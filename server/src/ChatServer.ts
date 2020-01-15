import * as express from 'express';
import * as socketIo from 'socket.io';
import { CONNECTED, DISCONNECTED, MESSAGE } from './constants';
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
        console.log('User disconnected');
      });

      socket.on('action', action => {
        if (action.type === 'SERVER_CONNECT') {
          console.log(action.type, action.data);
          socket.emit('action', { type: 'UPDATE_CONNECTION_STATUS', data: true });
        }
      });
    });
  }

  get app(): express.Application {
    return this._app;
  }
}
