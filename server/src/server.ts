import * as gracefulExit from 'express-graceful-exit';
import { ChatServer } from './ChatServer';

const chatServer = new ChatServer(10000);

const app = chatServer.app;
const server = chatServer.server;
const io = chatServer.io;

const addProcessListeners = (): void => {
  gracefulExit.init(server);
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

const shutdown = (): void => {
  chatServer.shutdown();
  setTimeout(() => {
    gracefulExit.gracefulExitHandler(app, server, {
      log: true,
      socketio: io,
      suicideTimeout: 20000,
    });
  }, 5000);
};

addProcessListeners();

export { app };
