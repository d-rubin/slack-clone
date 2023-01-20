import { object } from "@angular/fire/database";

export interface IConversation {
  members: string[];
  name: string;
  conversationID: string;
  messages: [];
}

export class Conversation {
  members: string[];
  name: string;
  conversationID: string;
  messages: [];

  constructor(obj?: IConversation) {
    this.members = obj? obj.members: [];
    this.name = obj? obj.name: '';
    this.messages = obj? obj.messages: [];
    this.conversationID = obj? obj.conversationID: '';
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
