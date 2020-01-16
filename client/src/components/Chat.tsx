import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Input, InputGroup, Button, List, ListItem, ScrollView } from 'sancho';
import StateInterface from '../Models/StateInterface';
import MessageInterface from '../Models/MessageInterface';
import { addMessageSocket } from '../store/actions/chat';
import moment from 'moment/moment';

interface Props {
  username: string;
  messages: MessageInterface[];
  addMessageSocket: (message: MessageInterface) => void;
}

const Chat: React.FC<Props> = ({ username, messages, addMessageSocket }) => {
  const [message, setMessage] = useState({ sender: username, message: '' });

  const submitMessage = (event: any) => {
    event.preventDefault();
    addMessageSocket(message);
  };

  return (
    <div>
      Chat!
      <div>{username}</div>
      <br />
      <List>
        <ScrollView overflowY style={{ height: '300px' }}>
          {messages.map((message, index) => {
            return (
              <ListItem
                key={index}
                primary={message.message}
                secondary={`${message.sender} ${moment(message.time).format(
                  'hh:mm',
                )}`}
                interactive={false}
              />
            );
          })}
        </ScrollView>
      </List>
      <form onSubmit={event => submitMessage(event)}>
        <InputGroup label='Chat message'>
          <Input
            placeholder='Enter your message'
            value={message.message}
            onChange={event => {
              setMessage({ ...message, message: event.target.value });
            }}
          />
        </InputGroup>
      </form>
    </div>
  );
};

const mapStateToProps = (state: StateInterface) => ({
  username: state.system.username,
  messages: state.messages,
});

export default connect(mapStateToProps, { addMessageSocket })(Chat);
