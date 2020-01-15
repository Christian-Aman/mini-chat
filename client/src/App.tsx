import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './store/store';
import Container from './components/Container';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className='App'>
        <Container />
      </div>
    </Provider>
  );
};

export default App;
