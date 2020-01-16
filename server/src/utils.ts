import ServerMessageInterface from './ServerMessageInterface';

export const generateServerMessage = (
  success: boolean,
  id: string,
  message: string,
  username?: string,
): ServerMessageInterface => {
  return {
    success,
    sender: 'Server',
    id,
    username,
    message,
    time: Date.now(),
  };
};
