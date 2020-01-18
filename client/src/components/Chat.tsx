import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, ScrollView, Layer } from 'sancho';
import moment from 'moment/moment';
import InputForm from './InputForm';
import StateInterface from '../Models/StateInterface';
import MessageInterface from '../Models/MessageInterface';
import SystemMessageInterface from '../Models/SystemMessageInterface';
import { addMessageSocket } from '../store/actions/chat';
import { reconnect, addError } from '../store/actions/system';

interface Props {
  id: string;
  username: string;
  reconnected: boolean;
  messages: MessageInterface[];
  systemMessages: SystemMessageInterface[];
  addMessageSocket: (message: MessageInterface) => void;
  reconnect: (id: string) => void;
  addError: (imessage: string, intent: string) => void;
}

const Chat: React.FC<Props> = ({
  id,
  username,
  messages,
  systemMessages,
  addMessageSocket,
  reconnected,
  reconnect,
  addError,
}) => {
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
    scrollDown();
    if (reconnected) {
      reconnect(id);
    }
  });

  const submitMessage = (message: string) => {
    switch (message) {
      case '':
        addError('Please enter a message', 'warning');
        break;

      default:
        addMessageSocket({ id, sender: username, message });
        break;
    }
  };

  return (
    <div>
      <List>
        <ScrollView
          overflowY
          style={{
            height: '400px',
            width: '100%',
            borderBottom: '1px solid rgba(0,0,0, 0.1)',
          }}>
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
      <InputForm
        buttonText='Send'
        inputLabel='Chat message'
        inputPlaceholder='Enter your message'
        callbackFunction={message => {
          submitMessage(message);
        }}
      />
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
  reconnect,
  addError,
})(Chat);
