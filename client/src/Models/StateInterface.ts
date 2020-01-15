import MessageInterface from './MessageInterface';
import SystemStateInterface from './SystemStateInterface';

export default interface StateInterface {
  system: SystemStateInterface;
  messages: MessageInterface[];
}
