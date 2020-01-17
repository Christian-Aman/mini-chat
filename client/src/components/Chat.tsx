import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import {
  Input,
  InputGroup,
  Button,
  List,
  ListItem,
  ScrollView,
  Layer,
} from 'sancho';
import StateInterface from '../Models/StateInterface';
import MessageInterface from '../Models/MessageInterface';
import SystemMessageInterface from '../Models/SystemMessageInterface';
import { addMessageSocket } from '../store/actions/chat';
import { disconnect, reconnect } from '../store/actions/system';
import moment from 'moment/moment';

interface Props {
  id: string;
  username: string;
  reconnected: boolean;
  messages: MessageInterface[];
  systemMessages: SystemMessageInterface[];
  addMessageSocket: (message: MessageInterface) => void;
  disconnect: (id: string) => void;
  reconnect: (id: string) => void;
}

const Chat: React.FC<Props> = ({
  id,
  username,
  messages,
  systemMessages,
  addMessageSocket,
  disconnect,
  reconnected,
  reconnect,
}) => {
  const [message, setMessage] = useState({ id, sender: username, message: '' });
  const scrollViewEnd = useRef<HTMLDivElement>(null);

  let combinedMessages: any[] = [...messages, ...systemMessages].sort(
    (a, b) => Number(a.time) - Number(b.time),
  );

  const scrollDown = () => {
    const scrollView = scrollViewEnd.current;

    if (scrollView) {
      scrollView.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setMessage({ ...message, message: '' });
    scrollDown();
    if (reconnected) {
      reconnect(id);
    }
  }, [messages, systemMessages, reconnected, id]);

  const submitMessage = (event: any) => {
    event.preventDefault();
    addMessageSocket(message);
  };

  return (
    <div>
      Chat!
      <div>
        {username}
        <Button
          onClick={() => {
            disconnect(id);
          }}>
          Disconnect
        </Button>
      </div>
      <br />
      <List>
        <ScrollView overflowY style={{ height: '400px', width: '100%' }}>
          {combinedMessages.map((message, index) => {
            return (
              <Layer
                key={index}
                elevation='sm'
                style={{
                  margin: '10px',
                }}>
                <ListItem
                  primary={message.sender}
                  secondary={moment(message.time).format('hh:mm')}
                  interactive={false}
                  style={{
                    textAlign: message.sender === username ? 'right' : 'left',
                  }}>
                  {message.message}
                </ListItem>
              </Layer>
            );
          })}
          <div ref={scrollViewEnd}></div>
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
  id: state.system.id,
  username: state.system.username,
  reconnected: state.system.reconnected,
  messages: state.messages,
  systemMessages: state.system.systemMessages,
});

export default connect(mapStateToProps, {
  addMessageSocket,
  disconnect,
  reconnect,
})(Chat);
