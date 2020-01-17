import { SERVER_CONNECT, SERVER_DISCONNECT, SERVER_RECONNECT } from './types';

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
