import {
  SERVER_CONNECT,
  SERVER_DISCONNECT,
  SERVER_RECONNECT,
  ERROR_MESSAGE,
} from './types';

export const updateSocketConnection = (username: string) => {
  return {
    type: SERVER_CONNECT,
    data: username,
  };
};

export const disconnect = (id: string) => {
  return {
    type: SERVER_DISCONNECT,
    data: id,
  };
};

export const reconnect = (id: string) => {
  return {
    type: SERVER_RECONNECT,
    data: id,
  };
};

export const addError = (message: string, intent: string) => {
  const time = Date.now();
  return {
    type: ERROR_MESSAGE,
    data: {
      sender: 'System',
      message,
      intent,
      time,
    },
  };
};
