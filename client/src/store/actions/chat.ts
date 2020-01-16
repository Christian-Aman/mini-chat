import { SERVER_ADD_MESSAGE } from './types';
import MessageInterface from '../../Models/MessageInterface';

export const addMessageSocket = (message: MessageInterface) => {
  return {
    type: SERVER_ADD_MESSAGE,
    data: message,
  };
};
