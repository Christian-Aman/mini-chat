import { ADD_MESSAGE, UPDATE_CONNECTION_STATUS } from './types';
import MessageInterface from '../../Models/MessageInterface';

export const addMessage = (message: MessageInterface) => {
  return {
    type: ADD_MESSAGE,
    payload: message,
  };
};

export const updateConnection = () => {
  return {
    type: UPDATE_CONNECTION_STATUS,
  };
};
