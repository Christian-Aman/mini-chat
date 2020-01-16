import * as express from 'express';
import * as socketIo from 'socket.io';
import {
  SERVER_ADD_MESSAGE,
  SERVER_CONNECT,
  ADD_MESSAGE,
  UPDATE_CONNECTION_STATUS,
  USER_DISCONNECTED_QUIT,
  USER_DISCONNECTED_TIMEOUT,
  ERROR_MESSAGE,
  USER_FORCE_DISCONNECTED,
} from './constants';
import { ChatMessageInterface } from './ChatMessageInterface';
import { createServer, Server } from 'http';
import { Users } from './Users';
import UserInterface from './UserInterface';
import ServerMessageInterface from './ServerMessageInterface';
import { generateServerMessage } from './utils';

export class ChatServer {
  private static readonly PORT: number;
  private _app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: number;
  private userList: Users;
  private chatRoom: string;
  private idleTimeout: number;

  constructor() {
    this._app = express();
    this.port = Number(process.env.PORT) || 5000;
    this.server = createServer(this._app);
    this.userList = new Users();
    this.chatRoom = 'chatRoom';
    this.idleTimeout = 5000;
    this.initSocket();
    this.listen();
    this.activityTimer();
  }

  private initSocket(): void {
    this.io = socketIo(this.server);
  }

  private activityTimer(): void {}

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });

    this.io.on('connection', (socket: any) => {
      console.log(`a user connected: ${socket.id}`);

      setInterval(() => {
        let inactiveUsers = this.userList.checkInactivity(this.idleTimeout);
        if (inactiveUsers) {
          // console.log(inactiveUsers);
          inactiveUsers.forEach(user => {
            this.userList.removeUser(user.id);
            socket.leave(this.chatRoom);
            console.log(`${user.username} was disconnected due to inactivity`);
            socket.emit('action', {
              type: USER_FORCE_DISCONNECTED,
              data: generateServerMessage(
                true,
                socket.id,
                'You were disconnected due to inactivity',
              ),
            });

            this.io.to(this.chatRoom).emit('action', {
              type: USER_DISCONNECTED_TIMEOUT,
              data: generateServerMessage(
                true,
                user.id,
                `${user.username} was disconnected due to inactivity`,
                user.username,
              ),
            });
          });
        }
        inactiveUsers = [];
      }, 1000);

      socket.on('disconnect', reason => {
        socket.broadcast.emit('action', {
          type: USER_DISCONNECTED_QUIT,
        });
        this.userList.removeUser(socket.id);
        console.log(`User disconnected: ${reason}`);
      });

      socket.on('action', ({ type, data }: { type: string; data: any }) => {
        switch (type) {
          case SERVER_CONNECT:
            console.log(type, data);
            const result = this.userList.createUser(socket.id, data);

            socket.join(this.chatRoom, () => {
              socket.emit('action', {
                type: UPDATE_CONNECTION_STATUS,
                data: result,
              });
            });

            // this.io.emit('action')

            break;
          case SERVER_ADD_MESSAGE:
            console.log(type, data);
            if (this.userList.getUser(socket.id)) {
              this.io.to(this.chatRoom).emit('action', {
                type: ADD_MESSAGE,
                data: { ...data, time: Date.now() },
              });
              break;
            }
            socket.emit(
              'action',
              generateServerMessage(
                false,
                socket.id,
                'Please join the chat first!',
              ),
            );
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
