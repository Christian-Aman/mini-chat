import {
  UPDATE_CONNECTION_STATUS,
  CLEAR_SYSTEM_MESSAGES,
  USER_DISCONNECTED_TIMEOUT,
  USER_FORCE_DISCONNECTED,
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
        systemMessages: [data],
      };
    case CLEAR_SYSTEM_MESSAGES:
      return {
        ...state,
        systemMessages: [],
      };
    case USER_DISCONNECTED_TIMEOUT:
      return {
        ...state,
        systemMessages: [...state.systemMessages, data],
      };
    case USER_FORCE_DISCONNECTED:
      return {
        ...initalState,
        systemMessages: [data],
      };
    default:
      return state;
  }
};

export default systemReducer;
