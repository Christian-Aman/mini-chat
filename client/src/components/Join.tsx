import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, InputGroup, Input } from 'sancho';

import { updateSocketConnection } from '../store/actions/system';

interface Props {
  updateSocketConnection: (name: string) => void;
}

const Join: React.FC<Props> = ({ updateSocketConnection }) => {
  const [username, setUsername] = useState('');

  const submit = (event: any): void => {
    event.preventDefault();
    updateSocketConnection(username);
  };

  return (
    <div>
      <form onSubmit={event => submit(event)}>
        <InputGroup label='Username'>
          <Input
            placeholder='Enter your username'
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
        </InputGroup>
        <Button variant='outline' onClick={submit}>
          Join
        </Button>
      </form>
    </div>
  );
};

export default connect(null, { updateSocketConnection })(Join);
