import { UPDATE_CONNECTION_STATUS } from '../actions/types';
import SystemStateInterface from '../../Models/SystemStateInterface';

const initalState: SystemStateInterface = {
  connected: false,
  username: undefined,
};

const systemReducer = (
  state: SystemStateInterface = initalState,
  { type, data }: { type: string; data: SystemStateInterface },
): SystemStateInterface => {
  switch (type) {
    case UPDATE_CONNECTION_STATUS:
      console.log(type, data);
      return { ...state, connected: data.connected, username: data.username };
    default:
      return state;
  }
};

export default systemReducer;
