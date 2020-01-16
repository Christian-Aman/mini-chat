import * as express from 'express';
import * as socketIo from 'socket.io';
import {
  SERVER_ADD_MESSAGE,
  SERVER_CONNECT,
  ADD_MESSAGE,
  UPDATE_CONNECTION_STATUS,
  USER_DISCONNECTED_EXIT,
  USER_DISCONNECTED_TIMEOUT,
} from './constants';
import { ChatMessage } from './types';
import { createServer, Server } from 'http';

export class ChatServer {
  private static readonly PORT: number;
  private _app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: number;

  constructor() {
    this._app = express();
    this.port = Number(process.env.PORT) || 5000;
    this.server = createServer(this._app);
    this.initSocket();
    this.listen();
  }

  private initSocket(): void {
    this.io = socketIo(this.server);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });

    this.io.on('connection', (socket: any) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        socket.broadcast.emit('action', {
          type: USER_DISCONNECTED_EXIT,
        });
        console.log('User disconnected');
      });

      socket.on('action', ({ type, data }: { type: string; data: any }) => {
        switch (type) {
          case SERVER_CONNECT:
            console.log(type, data);
            socket.emit('action', {
              type: UPDATE_CONNECTION_STATUS,
              data: { connected: true, username: data },
            });
            break;
          case SERVER_ADD_MESSAGE:
            console.log(type, data);
            this.io.emit('action', {
              type: ADD_MESSAGE,
              data: { ...data, time: Date.now() },
            });
          default:
            break;
        }
      });
    });
  }

  get app(): express.Application {
    return this._app;
  }
}
