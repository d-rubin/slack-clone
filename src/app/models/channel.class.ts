export class Channel {
  name: string;
  members: string[];
  adminChannel: string;
  messages: [];

  constructor() {
    this.name = '';
    this.members = [];
    this.adminChannel = '';
    this.messages = [];
  }

  toJSON() {
    return {
      name: this.name,
      members: this.members,
      adminChannel: this.adminChannel,
      messages: this.messages,
    };
  }
}