import { ADD_MESSAGE, SERVER_ADD_MESSAGE } from './types';
import MessageInterface from '../../Models/MessageInterface';

export const addMessageSocket = (message: MessageInterface) => {
  return {
    type: SERVER_ADD_MESSAGE,
    data: message,
  };
};

export const addMessage = (message: MessageInterface) => {
  return {
    type: ADD_MESSAGE,
    data: message,
  };
};
