export default interface SystemMessageInterface {
  success?: boolean;
  id?: string;
  sender: string;
  username?: string;
  message: string;
  time: number;
}
