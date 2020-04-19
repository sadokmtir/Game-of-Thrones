import * as express from 'express';
import {ComplexityController} from '../../../src/controllers/UserController';

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
        const userController = new ComplexityController();
        expect(routeSpy).toHaveBeenNthCalledWith(1, '/users');
        expect(routeSpy).toHaveBeenNthCalledWith(2, '/users/:id');
    });
});