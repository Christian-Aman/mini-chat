import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import chatReducer from './reducers/chat';

const store = createStore(chatReducer, compose(applyMiddleware(thunk)));

export default store;
