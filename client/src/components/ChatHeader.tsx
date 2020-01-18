import React from 'react';
import { connect } from 'react-redux';
import { Toolbar, Text, CloseButton } from 'sancho';
import { disconnect } from '../store/actions/system';

import StateInterface from '../Models/StateInterface';

interface Props {
  id: string;
  isConnected: boolean;
  disconnect: (id: string) => void;
}

const ChatHeader: React.FC<Props> = ({ id, isConnected, disconnect }) => {
  return (
    <div>
      <Toolbar
        style={{
          backgroundColor: 'rgba(0,0,0, 0.1)',
          borderBottom: '1px solid rgba(0,0,0, 0.2)',
          justifyContent: 'center',
        }}>
        <Text
          variant='h1'
          style={{ margin: '0.5em 0', color: 'rgba(0,0,0, 0.7)' }}>
          Mini-Chat
        </Text>
        {isConnected && (
          <div style={{ position: 'absolute', right: '1em' }}>
            <CloseButton
              onClick={() => {
                disconnect(id);
              }}
            />
          </div>
        )}
      </Toolbar>
    </div>
  );
};

const mapStateToProps = (state: StateInterface) => ({
  id: state.system.id,
  isConnected: state.system.connected,
});

export default connect(mapStateToProps, { disconnect })(ChatHeader);
