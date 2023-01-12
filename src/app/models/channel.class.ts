export class Channel {
  name: string;
  members: string[];
  adminChannel: string;
  messages: [];
  channelID: string;

  constructor() {
    this.name = '';
    this.members = [];
    this.adminChannel = '';
    this.messages = [];
    this.channelID = '';
  }

  toJSON() {
    return {
      name: this.name,
      members: this.members,
      adminChannel: this.adminChannel,
      messages: this.messages,
      channelId: this.channelID,
    };
  }
}
