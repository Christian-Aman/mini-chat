import * as express from 'express';
import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';
import { Users } from './Users';
import { generateServerMessage, logger, ioLogger, createWriter } from './utils';
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

export class ChatServer {
  private _app: express.Application;
  private _server: Server;
  private _io: SocketIO.Server;
  private port: number;
  private userList: Users;
  private chatRoom: string;
  private idleTimeout: number;
  private writer: any;

  constructor(idleTimeout: number) {
    this._app = express();
    this._server = createServer(this._app);
    this.port = Number(process.env.PORT) || 5000;
    this.userList = new Users();
    this.chatRoom = 'chatRoom';
    this.idleTimeout = idleTimeout;
    this.writer = createWriter('log/events.log', { flags: 'a' });
    this.initSocket();
    this.listen();
    this.activityTimer();
  }

  private initSocket(): void {
    this._io = socketIo(this._server, {
      pingTimeout: 15000,
      pingInterval: 30000,
    });
  }

  private activityTimer(): void {
    setInterval(() => {
      let inactiveUsers = this.userList.checkInactivity(this.idleTimeout);
      if (inactiveUsers) {
        inactiveUsers.forEach(user => {
          logger(
            this.writer,
            `User was disconnected due to inactivity`,
            user.id,
          );
          this.userList.removeUser(user.id);
          this._io.to(`${user.id}`).emit('action', {
            type: DISCONNECT_USER,
            data: generateServerMessage(
              true,
              user.id,
              'You were disconnected due to inactivity',
            ),
          });
          this._io.sockets.connected[user.id].leave(this.chatRoom);
          this._io.to(this.chatRoom).emit('action', {
            type: ADMIN_MESSAGE,
            data: generateServerMessage(
              true,
              user.id,
              `${user.username} was disconnected due to inactivity`,
              'info',
              user.username,
            ),
          });
        });
      }
      inactiveUsers = [];
    }, 1000);
  }

  private listen(): void {
    this._server.listen(this.port, () => {
      logger(this.writer, `Server running on port ${this.port}`);
    });

    this._io.on('connection', (socket: any) => {
      logger(this.writer, 'A user connected', socket.id);
      socket.emit('action', { type: RECONNECT_USER });

      socket.on('disconnect', reason => {
        logger(this.writer, `User disconnected: ${reason}`, socket.id);

        if (reason === 'transport close') {
          if (this.userList.getUser(socket.id)) {
            socket.leave(this.chatRoom);
            this._io.to(this.chatRoom).emit('action', {
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
            const result = this.userList.createUser(socket.id, data);
            logger(
              this.writer,
              result.success
                ? 'User successfully joined'
                : 'User failed to join',
              socket.id,
            );

            socket.emit('action', {
              type: CONNECT_USER,
              data: result,
            });
            if (result.success) {
              socket.join(this.chatRoom);
            }

            if (result.success) {
              this._io.to(this.chatRoom).emit('action', {
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
            this.userList.removeUser(data);

            logger(this.writer, 'User left', socket.id);

            socket.leave(this.chatRoom, () => {
              socket.emit('action', {
                type: DISCONNECT_USER,
                data: generateServerMessage(true, data, 'You left the chat'),
              });

              this._io.to(this.chatRoom).emit('action', {
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
            logger(this.writer, 'User reconnected', socket.id);
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
            // console.log(type, data);
            logger(
              this.writer,
              `New message: ${data.sender}: ${data.message}`,
              socket.id,
            );
            if (this.userList.getUser(socket.id)) {
              this._io.to(this.chatRoom).emit('action', {
                type: ADD_MESSAGE,
                data: { ...data, time: Date.now() },
              });
              this.userList.updateUserActivity(data.id);
              break;
            }
            logger(
              this.writer,
              `User tried to send meddage without having joined`,
              socket.id,
            );
            socket.emit('action', {
              type: ERROR_MESSAGE,
              data: generateServerMessage(
                false,
                'Please join the chat first!',
                socket.id,
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

  get server(): Server {
    return this._server;
  }

  get io(): SocketIO.Server {
    return this._io;
  }

  public shutdown(): void {
    logger(this.writer, 'Shutting down server');
    this._io
      .to(this.chatRoom)
      .emit(
        'action',
        generateServerMessage(true, '1', 'Server is going offline'),
      );
  }
}
