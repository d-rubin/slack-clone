
export interface IChannel {
  name: string;
  members: string[];
  adminChannel: string;
  messages: [];
  channelId: string;
}

export class Channel {
  name: string;
  members: string[];
  adminChannel: string;
  messages: [];
  channelId: string;

  constructor(obj?: IChannel) {
    this.name = obj? obj.name : '';
    this.members = obj? obj.members : [];
    this.adminChannel = obj? obj.adminChannel : '';
    this.messages = obj? obj.messages : [];
    this.channelId = obj? obj.channelId : '';
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
