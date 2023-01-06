export class User {
  name: any;
  email: any;
  currentUserId: any;
  currentChannelId: any;
  memberInChannel: any[];

  constructor() {
    this.name = '';
    this.email = '';
    this.currentUserId = '';
    this.currentChannelId = '';
    this.memberInChannel = [];
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      currentUserId: this.currentUserId,
      currentChannelId: this.currentChannelId,
      memberInChannel: this.memberInChannel,
    };
  }
}
