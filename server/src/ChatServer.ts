import * as express from 'express';
import * as socketIo from 'socket.io';
import * as moment from 'moment/moment';
import {
  SERVER_ADD_MESSAGE,
  SERVER_CONNECT,
  SERVER_DISCONNECT,
  SERVER_RECONNECT,
  CONNECT_USER,
  DISCONNECT_USER,
  RECONNECT_USER,
  UPDATE_USER_ID,
  ADMIN_MESSAGE,
  ADD_MESSAGE,
  ERROR_MESSAGE,
} from './constants';
import { ChatMessageInterface } from './ChatMessageInterface';
import { createServer, Server } from 'http';
import { Users } from './Users';
import UserInterface from './UserInterface';
import ServerMessageInterface from './ServerMessageInterface';
import { generateServerMessage } from './utils';
import { isRegExp } from 'util';

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
    this.idleTimeout = 30000;
    this.initSocket();
    this.listen();
    this.activityTimer();
  }

  private initSocket(): void {
    this.io = socketIo(this.server, {
      pingTimeout: 15000,
      pingInterval: 30000,
    });
  }

  private activityTimer(): void {}

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });

    this.io.on('connection', (socket: any) => {
      console.log(
        `a user connected: ${socket.id}, ${moment().format('hh:mm:ss')}`,
      );

      socket.emit('action', { type: RECONNECT_USER });

      setInterval(() => {
        let inactiveUsers = this.userList.checkInactivity(this.idleTimeout);
        if (inactiveUsers) {
          inactiveUsers.forEach(user => {
            this.userList.removeUser(user.id);
            console.log(`${user.username} was disconnected due to inactivity`);
            socket.emit('action', {
              type: DISCONNECT_USER,
              data: generateServerMessage(
                true,
                socket.id,
                'You were disconnected due to inactivity',
              ),
            });

            socket.leave(this.chatRoom);
            this.io.to(this.chatRoom).emit('action', {
              type: ADMIN_MESSAGE,
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
        console.log(
          `User disconnected: ${reason}, ${socket.id}, ${moment().format(
            'hh:mm:ss',
          )}`,
        );
        if (reason === 'transport close') {
          if (this.userList.getUser(socket.id)) {
            socket.leave(this.chatRoom);
            this.io.to(this.chatRoom).emit('action', {
              type: ADMIN_MESSAGE,
              data: generateServerMessage(
                true,
                socket.id,
                `${
                  this.userList.getUser(socket.id).username
                } has left the chat.`,
                socket.username,
              ),
            });
            this.userList.removeUser(socket.id);
          }
        }
      });

      socket.on('action', ({ type, data }: { type: string; data: any }) => {
        switch (type) {
          case SERVER_CONNECT:
            console.log(type, data);
            const result = this.userList.createUser(socket.id, data);

            socket.join(this.chatRoom, () => {
              socket.emit('action', {
                type: CONNECT_USER,
                data: result,
              });
            });

            if (result.success) {
              this.io.emit('action', {
                type: ADMIN_MESSAGE,
                data: generateServerMessage(
                  true,
                  socket.id,
                  `${result.username} has joined the chat.`,
                ),
              });
            }
            break;

          case SERVER_DISCONNECT:
            this.userList.removeUser(data.id);
            socket.leave(this.chatRoom, () => {
              socket.emit('action', {
                type: DISCONNECT_USER,
                data: generateServerMessage(true, data, 'You left the chat'),
              });

              this.io.to(this.chatRoom).emit('action', {
                type: ADMIN_MESSAGE,
                data: generateServerMessage(
                  true,
                  data.id,
                  `${data.username} left the chat.`,
                ),
              });
            });
            break;

          case SERVER_RECONNECT:
            this.userList.updateUserId(data, socket.id);
            socket.join(this.chatRoom);
            socket.emit('action', {
              type: UPDATE_USER_ID,
              data: generateServerMessage(
                true,
                socket.id,
                'Reconnected and updated user id',
              ),
            });
            break;

          case SERVER_ADD_MESSAGE:
            console.log(type, data);
            if (this.userList.getUser(socket.id)) {
              this.io.to(this.chatRoom).emit('action', {
                type: ADD_MESSAGE,
                data: { ...data, time: Date.now() },
              });
              this.userList.updateUserActivity(data.id);
              break;
            }
            socket.emit('action', {
              type: ERROR_MESSAGE,
              data: generateServerMessage(
                false,
                socket.id,
                'Please join the chat first!',
              ),
            });
            break;
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
