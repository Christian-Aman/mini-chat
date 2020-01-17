import { generateServerMessage } from './utils';
import UserInterface from './UserInterface';
import ServerMessageInterface from './ServerMessageInterface';

export class Users {
  private users: UserInterface[] = [];

  private isUsernameTaken(username: string): boolean {
    return this.users.some(user => user.username === username);
  }

  public getUser(id: string): UserInterface {
    return this.users.find(user => user.id === id);
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

  public updateUserId(id: string, newId: string): UserInterface {
    this.users = this.users.map(user =>
      user.id === id ? { ...user, id: newId } : user,
    );
    return this.users.find(user => user.id === newId);
  }

  public removeUser(id: string): void {
    this.users = this.users.filter(user => user.id !== id);
  }
}
