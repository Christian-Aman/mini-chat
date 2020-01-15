import React from 'react';
import { connect } from 'react-redux';
import StateInterface from '../Models/StateInterface';

import Join from './Join';
import Chat from './Chat';

interface Props {
  isConnected: boolean;
}

const Contariner: React.FC<Props> = ({ isConnected }) => {
  return <div>{isConnected ? <Chat /> : <Join />}</div>;
};

const mapStateToProps = (state: StateInterface) => ({
  isConnected: state.system.connected,
});

export default connect(mapStateToProps)(Contariner);
