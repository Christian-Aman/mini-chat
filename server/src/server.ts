import { ChatServer } from './ChatServer';

const app = new ChatServer(30000).app;

export { app };
