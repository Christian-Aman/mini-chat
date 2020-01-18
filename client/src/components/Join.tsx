import React from 'react';
import { connect } from 'react-redux';

import { updateSocketConnection, addError } from '../store/actions/system';
import InputForm from './InputForm';

interface Props {
  updateSocketConnection: (name: string) => void;
  addError: (imessage: string, intent: string) => void;
}

const Join: React.FC<Props> = ({ updateSocketConnection, addError }) => {
  const submit = (username: string): void => {
    switch (username) {
      case '':
        addError('Please enter a username', 'warning');
        break;

      default:
        updateSocketConnection(username);
        break;
    }
  };

  return (
    <div>
      <InputForm
        buttonText='Join'
        inputLabel='Username'
        inputPlaceholder='Enter your username'
        callbackFunction={username => {
          submit(username);
        }}
      />
    </div>
  );
};

export default connect(null, { updateSocketConnection, addError })(Join);
