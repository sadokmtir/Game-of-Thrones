import * as express from 'express';
import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {Readable} from 'stream';
import Controller from './Controller.interface';
import Nconf from '../infrastructure/Nconf';
import StreamTransformer from '../infrastructure/stream/StreamTransformer';
import logger from '../infrastructure/logging/Logger';
import {HouseValidator} from '../validators/HouseValidator';

const PARAM_TRIM = /[\s'"]/g;
const URL_TRIM = /[<>\s'"]/g;

enum PromiseState {
    RESOLVED = 'fulfilled',
    REJECTED = 'rejected'
}

export class HouseController implements Controller {
    readonly path: string;
    router: express.Router;
    private instance: AxiosInstance;
    private houseValidator: HouseValidator;

    constructor() {
        this.path = '/houses';
        this.instance = axios.create({
            baseURL: Nconf.get('remoteServer:url'),
            timeout: 3000,
        });
        this.houseValidator = new HouseValidator();
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.route(this.path)
            .get(this.fetchHouses);

        this.router.route(`${this.path}/:id([0-9]+)`)
            .get(this.houseValidator.validateGetHouseParams, this.getHouse);
    }

    getHouse = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const houseId = +request.params.id;
        const isAlive = request.query.isAlive;
        const members = [];
        try {
            const res = await this.instance.get(`houses/${houseId}`);
            const house = res.data;
            const membersUrls = house.swornMembers ?? [];
            if (membersUrls) {
                const responses: { status: string; value?: any; reason?: any }[]
                    = await Promise.all(membersUrls.map((membersUrl: string) => {
                    const relativeUrl = this.getRelativeUrl(membersUrl);
                    return this.instance.get(relativeUrl).then(
                        (res: AxiosResponse) => ({status: PromiseState.RESOLVED, value: res.data}),
                        (error) => {
                            logger.error('Failed fetching sworn member', error);
                            return {status: PromiseState.REJECTED, reason: error};
                        }
                    );
                }));
                const successfulPromises = responses.filter(res => {
                    const memberAlive = res.value.died === '';
                    return res.status === PromiseState.RESOLVED && memberAlive === isAlive;

                });
                for (const successfulPromise of successfulPromises) {
                    members.push(successfulPromise.value);
                }
            }
            house.swornMembers = members;
            response.status(200).json(house);
        } catch (e) {
            next(e);
        }
    };

    private getRelativeUrl(url: string): string {
        const result = url.match(/(characters\/\d{1,6})/);
        return result[1];
    }

    private fetchHouses = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const JsonStream = new StreamTransformer();
        const readable = Readable.from(this.getHousesPerPage(1));

        readable.pipe(JsonStream).pipe(response.type('json'));
    };


    private async* getHousesPerPage(page: number): any {
        logger.debug('fetching page number %s', page);
        try {
            const res = await this.instance.get(`houses?page=${page}&pageSize=50`);
            yield res.data;

            const nextPageUrl = this.getNexPageUrl(res.headers.link);
            if (nextPageUrl) {
                const result = nextPageUrl.match(/page=(\d{1,3})/);
                const pageNumber = +result[1] ?? 0;
                if (pageNumber > page) {
                    yield* this.getHousesPerPage(pageNumber);
                }
            }
        } catch (e) {
            logger.error('Failed to fetch', e);
        }
    }

    private getNexPageUrl(linkHeader: string) {
        if (linkHeader) {
            const linkHeaders = linkHeader.split(',');
            for (const linkValue of linkHeaders) {
                const linkParts = linkValue.split(';');
                const url = linkParts[0].replace(URL_TRIM, '');
                const params = linkParts.slice(1);

                for (const param of params) {
                    const paramParts = param.split('=');
                    const key = paramParts[0].replace(PARAM_TRIM, '');
                    const value = paramParts[1].replace(PARAM_TRIM, '');
                    if (key == 'rel' && value === 'next') {
                        return url;
                    }
                }
            }
        }

        return null;
    }

}