import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { CONNECTION_ERROR } from './actions/types';
import SystemMessageInterface from '../Models/SystemMessageInterface';

const socket = io('192.168.0.8:5000');

const socketIoMiddleware = createSocketIoMiddleware(socket, 'SERVER_');

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, socketIoMiddleware)),
);

socket.on('connect_error', () => {
  const data: SystemMessageInterface = {
    sender: 'System',
    message: 'Server is offline',
    time: Date.now(),
  };
  store.dispatch({ type: CONNECTION_ERROR, data });
});

export default store;
