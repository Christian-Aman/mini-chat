import ServerMessageInterface from './Models/ServerMessageInterface';

export const generateServerMessage = (
  success: boolean,
  id: string,
  message: string,
  intent?: 'warning' | 'danger' | 'info' | 'success' | 'question' | undefined,
  username?: string,
): ServerMessageInterface => {
  return {
    success,
    sender: 'Server',
    id,
    username,
    message,
    intent,
    time: Date.now(),
  };
};
