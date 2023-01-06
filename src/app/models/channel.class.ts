export class Channel {
  name: string;
  members: string[];
  adminChannel: string;
  messages: []; // Should get a Format like { message: [], userEmail: [] } --> Message[1] and userEmail[1] is connected

  constructor(obj?: any) {
    this.name = obj ? obj.name : '';
    this.members = obj ? obj.members : [];
    this.adminChannel = obj ? obj.adminChannel : '';
    this.messages = obj ? obj.messages : [];
  }

  public toJSON() {
    return {
      name: this.name,
      members: this.members,
      adminChannel: this.adminChannel,
      messages: this.messages,
    };
  }
}
