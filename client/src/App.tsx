import React, { useState } from 'react';
import './App.css';
import { isPrimitive } from 'util';

import Join from './components/Join';
import Chat from './components/Chat';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  return <div className='App'>{isConnected ? <Chat /> : <Join />}</div>;
};

export default App;
