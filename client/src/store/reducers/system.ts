import { UPDATE_CONNECTION_STATUS } from '../actions/types';
import SystemStateInterface from '../../Models/SystemStateInterface';

const initalState: SystemStateInterface = {
  connected: false,
};

const systemReducer = (state: SystemStateInterface = initalState, { type, data }: { type: string; data: boolean }): SystemStateInterface => {
  switch (type) {
    case UPDATE_CONNECTION_STATUS:
      console.log(type, data);
      return { ...state, connected: data };
    default:
      return state;
  }
};

export default systemReducer;
