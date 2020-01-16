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
import moment from 'moment/moment';

interface Props {
  username: string;
  messages: MessageInterface[];
  systemMessages: SystemMessageInterface[];
  addMessageSocket: (message: MessageInterface) => void;
}

const Chat: React.FC<Props> = ({
  username,
  messages,
  systemMessages,
  addMessageSocket,
}) => {
  const [message, setMessage] = useState({ sender: username, message: '' });
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
  }, [messages, systemMessages]);

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
        <ScrollView overflowY style={{ height: '400px', width: '100%' }}>
          {combinedMessages.map((message, index) => {
            return (
              <Layer
                elevation='sm'
                style={{
                  margin: '10px',
                }}>
                <ListItem
                  key={index}
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
  username: state.system.username,
  messages: state.messages,
  systemMessages: state.system.systemMessages,
});

export default connect(mapStateToProps, { addMessageSocket })(Chat);
