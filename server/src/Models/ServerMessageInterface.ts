export default interface SystemMessageInterface {
  success?: boolean;
  id?: string;
  sender: string;
  username?: string;
  message: string;
  intent?: 'warning' | 'danger' | 'info' | 'success' | 'question' | undefined;
  time: number;
}
