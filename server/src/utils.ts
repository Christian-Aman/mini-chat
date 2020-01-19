import * as moment from 'moment/moment';
import { createWriteStream } from 'fs';
import ServerMessageInterface from './Models/ServerMessageInterface';
import { DISCONNECT_USER, ADMIN_MESSAGE } from './constants';

export const generateServerMessage = (
  success: boolean,
  id: string,
  message: string,
  intent?: 'warning' | 'danger' | 'info' | 'success' | 'question' | undefined,
  username?: string,
): ServerMessageInterface => {
  return {
    success,
    sender: 'Server',
    id,
    username,
    message,
    intent,
    time: Date.now(),
  };
};

export const activityTimer = (
  io,
  chatRoom,
  userList,
  idleTimeout,
  writer,
  interval,
) => {
  setInterval(() => {
    let inactiveUsers = userList.checkInactivity(idleTimeout);
    if (inactiveUsers) {
      inactiveUsers.forEach(user => {
        logger(writer, `User was disconnected due to inactivity`, user.id);
        userList.removeUser(user.id);
        io.to(`${user.id}`).emit('action', {
          type: DISCONNECT_USER,
          data: generateServerMessage(
            true,
            user.id,
            'You were disconnected due to inactivity',
          ),
        });
        io.sockets.connected[user.id].leave(chatRoom);
        io.to(chatRoom).emit('action', {
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
  }, interval);
};

export const createWriter = (path: string, conf = { flags: 'a' }) => {
  const writer = createWriteStream(path, conf);
  return writer;
};

export const logger = (writer, action: string, id?: string) => {
  let message: string;
  const time = moment().format('YYYY-MM-DD hh:mm:ss');
  if (id) {
    message = `${time}: Socket:${id}, ${action}`;
  } else {
    message = `${time}: ${action}`;
  }
  writer.write(`${message}\n`);
  console.log(message);
};

export const ioLogger = (writer: any, socket: any, next: any) => {
  logger(writer, socket.id, 'A user connected'), next();
};
