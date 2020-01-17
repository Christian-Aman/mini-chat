import {
  CONNECT_USER,
  ADMIN_MESSAGE,
  DISCONNECT_USER,
  RECONNECT_USER,
  UPDATE_USER_ID,
} from '../actions/types';
import SystemStateInterface from '../../Models/SystemStateInterface';
import SystemMessageInterface from '../../Models/SystemMessageInterface';

const initalState: SystemStateInterface = {
  id: '',
  connected: false,
  reconnected: false,
  username: '',
  systemMessages: [],
};

const systemReducer = (
  state: SystemStateInterface = initalState,
  { type, data }: { type: string; data: SystemMessageInterface },
): SystemStateInterface => {
  switch (type) {
    case CONNECT_USER:
      console.log(type, data);
      return {
        ...state,
        id: data.id === undefined ? state.id : data.id,
        connected: data.success === undefined ? state.connected : data.success,
        username: data.username === undefined ? state.username : data.username,
        systemMessages: [data],
      };
    case ADMIN_MESSAGE:
      return {
        ...state,
        systemMessages: [...state.systemMessages, data],
      };
    case DISCONNECT_USER:
      return {
        ...initalState,
        systemMessages: [data],
      };
    case RECONNECT_USER:
      return { ...state, reconnected: state.connected ? true : false };
    case UPDATE_USER_ID:
      return {
        ...state,
        reconnected: false,
        id: data.id === undefined ? state.id : data.id,
      };
    default:
      return state;
  }
};

export default systemReducer;
