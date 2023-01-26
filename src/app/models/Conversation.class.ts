import { object } from '@angular/fire/database';

export interface IConversation {
  members: string[];
  name: string;
  conversationID: string;
  messages: [];
  type: string;
}

export class Conversation {
  members: string[];
  name: string;
  conversationID: string;
  messages: [];
  type: string;

  constructor(obj?: IConversation) {
    this.members = obj ? obj.members : [];
    this.name = obj ? obj.name : '';
    this.messages = obj ? obj.messages : [];
    this.conversationID = obj ? obj.conversationID : '';
    this.type = obj ? obj.type : 'conversation';
  }

  toJSON() {
    return {
      members: this.members,
      name: this.name,
      messages: this.messages,
      channelID: this.conversationID,
      type: this.type,
    };
  }
}
