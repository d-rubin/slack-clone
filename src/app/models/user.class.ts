import { object } from '@angular/fire/database';

export interface IUser {
  name: string;
  email: string;
  currentUserId: string;
  currentChannelId: string;
  memberInChannel: string[];
  onlineStatus: boolean;
}
export class User {
  name: string;
  email: string;
  currentUserId: string;
  currentChannelId: string;
  memberInChannel: string[];
  onlineStatus: boolean;

  constructor(obj?: IUser) {
    this.name = obj ? obj.name : '';
    this.email = obj ? obj.email : '';
    this.currentUserId = obj ? obj.currentUserId : '';
    this.currentChannelId = obj ? obj.currentChannelId : '';
    this.memberInChannel = obj ? obj.memberInChannel : [];
    this.onlineStatus = obj ? obj.onlineStatus : false;
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      currentUserId: this.currentUserId,
      currentChannelId: this.currentChannelId,
      memberInChannel: this.memberInChannel,
      onlineStatus: this.onlineStatus,
    };
  }
}
