import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import StateInterface from '../Models/StateInterface';
import { Container, Layer, useToast } from 'sancho';

import ChatHeader from './ChatHeader';
import Join from './Join';
import Chat from './Chat';
import SystemMessageInterface from '../Models/SystemMessageInterface';

interface Props {
  isConnected: boolean;
  errorMessages: SystemMessageInterface[];
}

const Contariner: React.FC<Props> = ({ isConnected, errorMessages }) => {
  const toast = useToast();

  useEffect(() => {
    if (errorMessages.length > 0) {
      const errorMessage = errorMessages.slice(-1)[0];
      toast({
        intent: errorMessage.intent,
        title: errorMessage.message,
        duration: 5000,
        position: 'bottom-right',
      });
    }
  });

  return (
    <Container style={{ padding: '2em', minHeight: '400px', height: '100%' }}>
      <Layer style={{ minHeight: '10vh', overflow: 'hidden' }} elevation='sm'>
        <ChatHeader />
        <div>{isConnected ? <Chat /> : <Join />}</div>
      </Layer>
    </Container>
  );
};

const mapStateToProps = (state: StateInterface) => ({
  isConnected: state.system.connected,
  errorMessages: state.system.errorMessages,
});

export default connect(mapStateToProps)(Contariner);
