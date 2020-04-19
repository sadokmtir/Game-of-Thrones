import 'reflect-metadata';
import Server from './Server';
import logger from './infrastructure/logging/Logger';
import {HouseController} from './controllers/HouseController';

process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled promise', reason);
});

const main = () => {
    const app = new Server([
        new HouseController(),
    ]);
    app.listen();
};

main();