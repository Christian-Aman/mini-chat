import {
  UPDATE_CONNECTION_STATUS,
  CLEAR_SYSTEM_MESSAGES,
} from '../actions/types';
import SystemStateInterface from '../../Models/SystemStateInterface';
import SystemMessageInterface from '../../Models/SystemMessageInterface';

const initalState: SystemStateInterface = {
  id: '',
  connected: false,
  username: '',
  systemMessages: [],
};

const systemReducer = (
  state: SystemStateInterface = initalState,
  { type, data }: { type: string; data: SystemMessageInterface },
): SystemStateInterface => {
  switch (type) {
    case UPDATE_CONNECTION_STATUS:
      console.log(type, data);
      return {
        ...state,
        connected: data.success === undefined ? state.connected : data.success,
        username: data.username === undefined ? state.username : data.username,
        systemMessages: [...state.systemMessages, data],
      };
    case CLEAR_SYSTEM_MESSAGES:
      return {
        ...state,
        systemMessages: [],
      };
    default:
      return state;
  }
};

export default systemReducer;
