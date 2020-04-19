import request from 'supertest';
import 'reflect-metadata';
import {HouseController} from '../../src/controllers/HouseController';
import Server from '../../src/Server';

describe('test HouseController routes', () => {
    const server = new Server([
        new HouseController(),
    ]);
    const app = server.app;

    describe('GET /houses/:id',  () => {
        it('should responds with valid json',  async () => {
            const response = await request(app).get('/houses/2');
            expect(response.status).toEqual(200);
            expect(response.body).toBeDefined()
        });

        it('should responds with 400 when isAlive is not valid',  async () => {
            const response = await request(app).get('/houses/2?isAlive=asdsa');
            expect(response.status).toEqual(400);
        });
    });

    describe('GET /houses/',  () => {
        it('should responds with valid json',  async () => {
            const response = await request(app).get('/houses/');
            expect(response.status).toEqual(200);
            expect(response.body).toBeDefined()
        }, 10000); //increased timeout to wait until the stream is done
    });


});
