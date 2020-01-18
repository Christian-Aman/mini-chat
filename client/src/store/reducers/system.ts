import {
  CONNECT_USER,
  ADMIN_MESSAGE,
  DISCONNECT_USER,
  RECONNECT_USER,
  UPDATE_USER_ID,
  CONNECTION_ERROR,
  ERROR_MESSAGE,
} from '../actions/types';
import SystemStateInterface from '../../Models/SystemStateInterface';
import SystemMessageInterface from '../../Models/SystemMessageInterface';

const initalState: SystemStateInterface = {
  id: '',
  connected: false,
  reconnected: false,
  username: '',
  systemMessages: [],
  errorMessages: [],
};

const systemReducer = (
  state: SystemStateInterface = initalState,
  { type, data }: { type: string; data: SystemMessageInterface },
): SystemStateInterface => {
  switch (type) {
    case CONNECT_USER:
      return {
        ...state,
        id: data.id === undefined ? state.id : data.id,
        connected: data.success === undefined ? state.connected : data.success,
        username: data.username === undefined ? state.username : data.username,
        systemMessages: [],
        errorMessages: [data],
      };
    case ADMIN_MESSAGE:
      return {
        ...state,
        systemMessages: [...state.systemMessages, data],
      };
    case DISCONNECT_USER:
      return {
        ...initalState,
        errorMessages: [...state.errorMessages, data],
      };
    case RECONNECT_USER:
      return { ...state, reconnected: state.connected ? true : false };
    case UPDATE_USER_ID:
      return {
        ...state,
        reconnected: false,
        id: data.id === undefined ? state.id : data.id,
      };
    case CONNECTION_ERROR:
      return {
        ...initalState,
        errorMessages: [...state.errorMessages, data],
      };
    case ERROR_MESSAGE:
      return {
        ...state,
        errorMessages: [data],
      };
    default:
      return state;
  }
};

export default systemReducer;
