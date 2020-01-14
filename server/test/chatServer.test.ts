import { expect } from 'chai';
import * as mocha from 'mocha';
import { ChatServer } from '../src/ChatServer';

describe('ChatServer', () => {
  let app;
  beforeEach(() => {
    app = new ChatServer().app;
  });

  it('Server to exist', () => {
    expect(app).to.not.equal(undefined);
  });
});
