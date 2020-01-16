import { UPDATE_CONNECTION_STATUS } from '../actions/types';
import SystemStateInterface from '../../Models/SystemStateInterface';
import SystemMessageInterface from '../../Models/SystemMessageInterface';

const initalState: SystemStateInterface = {
  id: '',
  connected: false,
  username: '',
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
      };
    default:
      return state;
  }
};

export default systemReducer;
