import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const socket = io('localhost:5000');

const socketIoMiddleware = createSocketIoMiddleware(socket, 'SERVER_');

const store = createStore(
  rootReducer,
  compose(applyMiddleware(thunk, socketIoMiddleware)),
);

export default store;
