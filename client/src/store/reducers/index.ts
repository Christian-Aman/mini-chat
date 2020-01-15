import { combineReducers } from 'redux';
import chatReducer from './chat';
import systemReducer from './system';

export default combineReducers({
  system: systemReducer,
  messages: chatReducer,
});
