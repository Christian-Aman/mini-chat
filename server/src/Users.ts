import UserInterface from './UserInterface';

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

  public createUser(id: string, username: string) {
    if (this.isUsernameTaken(username)) {
      return {
        success: false,
        sender: 'Server',
        id,
        username,
        message: 'Username allready taken',
        time: Date.now(),
      };
    }
    this.users.push({ id, username });
    return {
      success: true,
      sender: 'Server',
      id,
      username,
      message: `Welcome ${username}!`,
      time: Date.now(),
    };
  }

  public removeUser(id: string) {
    console.log(this.users);
    this.users = this.users.filter(user => user.id !== id);
  }
}
