export class Channel {
  name: string;
  members: string[];
  adminChannel: string;
  messages: [];
  channelId: string;

  constructor() {
    this.name = '';
    this.members = [];
    this.adminChannel = '';
    this.messages = [];
    this.channelId = '';
  }

  toJSON() {
    return {
      name: this.name,
      members: this.members,
      adminChannel: this.adminChannel,
      messages: this.messages,
      channelId: this.channelId,
    };
  }
}
