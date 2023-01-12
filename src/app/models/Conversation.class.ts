export class Conversation {
  members: string[];
  name: string;
  conversationID: string;
  messages: [];

  constructor() {
    this.members = [];
    this.name = '';
    this.messages = [];
    this.conversationID = '';
  }

  toJSON() {
    return {
      members: this.members,
      name: this.name,
      messages: this.messages,
      conversationID: this.conversationID,
    };
  }
}
