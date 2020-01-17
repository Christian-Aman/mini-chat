import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, InputGroup, Input, useToast } from 'sancho';

import { updateSocketConnection } from '../store/actions/system';
import StateInterface from '../Models/StateInterface';
import SystemMessageInterface from '../Models/SystemMessageInterface';

interface Props {
  connected: boolean;
  systemMessages: SystemMessageInterface[];
  updateSocketConnection: (name: string) => void;
}

const Join: React.FC<Props> = ({
  connected,
  systemMessages,
  updateSocketConnection,
}) => {
  const [username, setUsername] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (!connected) {
      if (systemMessages.length > 0) {
        toast({
          intent: 'danger',
          title: systemMessages.slice(-1)[0].message,
          duration: 6000,
          position: 'bottom-right',
        });
      }
    }
  }, [systemMessages]);

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

const mapStateToProps = (state: StateInterface) => ({
  connected: state.system.connected,
  systemMessages: state.system.systemMessages,
});

export default connect(mapStateToProps, { updateSocketConnection })(Join);
