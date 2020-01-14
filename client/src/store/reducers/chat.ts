import { ADD_MESSAGE, UPDATE_CONNECTION_STATUS } from '../actions/types';
import MessageInterface from '../../Models/MessageInterface';
import StateInterface from '../../Models/StateInterface';

const initalState: StateInterface = {
  connected: false,
  messages: [],
};

const chatReducer = (state: StateInterface = initalState, { type, payload }: { type: string; payload?: MessageInterface }): StateInterface => {
  switch (type) {
    case ADD_MESSAGE:
      return { ...state, messages: payload ? [...state.messages, payload] : [...state.messages] };
    case UPDATE_CONNECTION_STATUS:
      return { ...state, connected: !state.connected };
    default:
      return state;
  }
};

export default chatReducer;
