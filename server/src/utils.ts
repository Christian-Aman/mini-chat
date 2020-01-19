import * as moment from 'moment/moment';
import { createWriteStream } from 'fs';
import ServerMessageInterface from './Models/ServerMessageInterface';

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
