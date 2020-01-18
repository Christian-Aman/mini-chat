import SystemMessageInterface from './SystemMessageInterface';

export default interface SystemStateInterface {
  id: string;
  connected: boolean;
  reconnected: boolean;
  username: string;
  systemMessages: SystemMessageInterface[];
  errorMessages: SystemMessageInterface[];
}
