import { generateServerMessage } from './utils';
import UserInterface from './UserInterface';
import ServerMessageInterface from './ServerMessageInterface';

export class Users {
  private users: UserInterface[] = [];

  private isUsernameTaken(username: string): boolean {
    const result = this.users.some(user => user.username === username);
    return result;
  }

  public getUser(id: string): UserInterface {
    const result = this.users.find(user => user.id === id);
    return result;
  }

  public createUser(id: string, username: string): ServerMessageInterface {
    if (this.isUsernameTaken(username)) {
      return generateServerMessage(
        false,
        id,
        'Username allready taken',
        username,
      );
    }
    this.users.push({ id, username, lastActive: Date.now() });
    return generateServerMessage(true, id, `Welcome ${username}`, username);
  }

  public updateUserActivity(id: string): void {
    this.users = this.users.map(user =>
      user.id === id ? { ...user, lastActive: Date.now() } : user,
    );
  }

  public checkInactivity(time: number): UserInterface[] {
    const timeout = Date.now() - time;
    return this.users.filter(user => user.lastActive < timeout);
  }

  public removeUser(id: string) {
    this.users = this.users.filter(user => user.id !== id);
  }
}
