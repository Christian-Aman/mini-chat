import { SERVER_CONNECT, SERVER_DISCONNECT } from './types';

export const updateSocketConnection = (username: string) => {
  return {
    type: SERVER_CONNECT,
    data: username,
  };
};

export const disconnect = () => {
  return {
    type: SERVER_DISCONNECT,
  };
};
