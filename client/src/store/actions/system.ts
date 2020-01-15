import { UPDATE_CONNECTION_STATUS, SERVER_CONNECT } from './types';

export const updateSocketConnection = (username: string) => {
  return {
    type: SERVER_CONNECT,
    data: username,
  };
};

export const updateConnection = () => {
  return {
    type: UPDATE_CONNECTION_STATUS,
  };
};
