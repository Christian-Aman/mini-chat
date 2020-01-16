import SystemMessageInterface from './SystemMessageInterface';

export default interface SystemStateInterface {
  id: string;
  connected: boolean;
  username: string;
  systemMessages: SystemMessageInterface[];
}
