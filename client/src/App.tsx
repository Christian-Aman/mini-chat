import React, { useState } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './store/store';

import Join from './components/Join';
import Chat from './components/Chat';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <Provider store={store}>
      <div className='App'>{isConnected ? <Chat /> : <Join />}</div>
    </Provider>
  );
};

export default App;
