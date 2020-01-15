import React from 'react';
import { connect } from 'react-redux';
import StateInterface from '../Models/StateInterface';
import MessageInterface from '../Models/MessageInterface';

interface Props {
  username: string | undefined;
  messages: MessageInterface[];
}

const Chat: React.FC<Props> = ({ username, messages }) => {
  return (
    <div>
      Chat!
      <div>{username}</div>
      <br />
      <div>{messages}</div>
    </div>
  );
};

const mapStateToProps = (state: StateInterface) => ({
  username: state.system.username,
  messages: state.messages,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
