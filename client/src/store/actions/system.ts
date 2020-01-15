import { SERVER_CONNECT } from './types';

export const updateSocketConnection = (username: string) => {
  return {
    type: SERVER_CONNECT,
    data: username,
  };
};
