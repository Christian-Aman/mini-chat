import { ADD_MESSAGE, DISCONNECT_USER } from '../actions/types';
import MessageInterface from '../../Models/MessageInterface';

const initalState: MessageInterface[] = [];

const chatReducer = (
  state: MessageInterface[] = initalState,
  { type, data }: { type: string; data: MessageInterface },
): MessageInterface[] => {
  switch (type) {
    case ADD_MESSAGE:
      return [...state, data];
    case DISCONNECT_USER:
      return [];
    default:
      return state;
  }
};

export default chatReducer;
