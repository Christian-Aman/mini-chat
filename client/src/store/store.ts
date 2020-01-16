import { createStore, applyMiddleware, compose } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

const socket = io('localhost:5000');

// declare global {
//   interface Window {
//     __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
//   }
// }

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const socketIoMiddleware = createSocketIoMiddleware(socket, 'SERVER_');

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, socketIoMiddleware)),
);

export default store;
