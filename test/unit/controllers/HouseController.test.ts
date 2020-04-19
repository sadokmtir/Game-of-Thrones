import * as express from 'express';
import {HouseController} from '../../../src/controllers/HouseController';

describe('test the UserController', () => {

    let routeSpy: jest.SpyInstance;
    beforeEach(() => {
        // @ts-ignore
        routeSpy = jest.spyOn(express.Router, 'route');
    });
    afterEach(() => {
        routeSpy.mockClear();
    });

    it('should configure the routes paths /users and /users/:id', () => {
        const houseController = new HouseController();
        expect(routeSpy).toHaveBeenNthCalledWith(1, '/houses');
        expect(routeSpy).toHaveBeenNthCalledWith(2, '/houses/:id([0-9]+)');
    });
});
