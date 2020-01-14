import MessageInterface from './MessageInterface';

export default interface StateInterface {
  connected: boolean;
  messages: MessageInterface[];
}
