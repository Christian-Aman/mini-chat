import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import { updateConnection } from '../store/actions/chat';

interface Props {}

let socket;

const Join: React.FC<Props> = () => {
  const clickHandler = (): void => {
    socket = io('localhost:5000');
  };

  return (
    <div>
      Join!
      <input type='button' value='clickMEEE' onClick={clickHandler} />
    </div>
  );
};

export default connect(null, { updateConnection })(Join);
