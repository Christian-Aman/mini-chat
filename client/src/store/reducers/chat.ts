import { ADD_MESSAGE, UPDATE_CONNECTION_STATUS } from '../actions/types';
import MessageInterface from '../../Models/MessageInterface';

const initalState: MessageInterface[] = [];

const chatReducer = (state: MessageInterface[] = initalState, { type, data }: { type: string; data: MessageInterface }): MessageInterface[] => {
  switch (type) {
    case ADD_MESSAGE:
      return [...state, data];
    default:
      return state;
  }
};

export default chatReducer;
