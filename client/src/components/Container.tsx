import React from 'react';
import { connect } from 'react-redux';
import StateInterface from '../Models/StateInterface';
import { Container } from 'sancho';

import Join from './Join';
import Chat from './Chat';

interface Props {
  isConnected: boolean;
}

const Contariner: React.FC<Props> = ({ isConnected }) => {
  return <Container>{isConnected ? <Chat /> : <Join />}</Container>;
};

const mapStateToProps = (state: StateInterface) => ({
  isConnected: state.system.connected,
});

export default connect(mapStateToProps)(Contariner);
