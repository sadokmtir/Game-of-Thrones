import * as express from 'express';
import {validate, ValidationError} from 'class-validator';
import {plainToClass} from 'class-transformer';
import QueryParamsDto from '../dto/QueryParamsDto';
import HttpException from '../infrastructure/middleware/exceptions/HttpException';

export class HouseValidator {

    public validateGetHouseParams = (req: express.Request, res: express.Response, next: express.NextFunction) => {

        req.query.isAlive = this.transform(req.query.isAlive ?? true);
        validate(plainToClass(QueryParamsDto,
            {isAlive: req.query.isAlive},
            {enableImplicitConversion: true}),
            {skipMissingProperties: false, whitelist: true, forbidNonWhitelisted: true})
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
                    next(new HttpException(400, message));
                } else {
                    next();
                }
            });
    };

    private transform = (value: string) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    }
}