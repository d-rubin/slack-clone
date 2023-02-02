import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { Channel } from '../models/channel.class';
import { Conversation } from '../models/Conversation.class';
import { IUser, User } from '../models/user.class';
import { DataBase } from '../services/data.service';

@Component({
  selector: 'app-show-members',
  templateUrl: './show-members.component.html',
  styleUrls: ['./show-members.component.scss']
})
export class ShowMembersComponent implements OnInit {
  members: [] = [];
  currentUser: User;
  currentUserId: any;
  users: User[] = [];
  user: User;
  IndexOfUserToDeleteInChannel: number;
  IndexOfChannelToDeleteInUser: number;
  channel: Channel | Conversation;

  constructor(
    private firestore: AngularFirestore,
    public dataService: DataBase,
    private dialogRef: MatDialogRef<ShowMembersComponent>
    ) { }

  async ngOnInit() {
    await this.getMembersOfChannel();
  }

  getMembersOfChannel() {
    console.log('currentUser in show-members: ', this.dataService.currentUser);
    return new Promise (async (resolve: Function, reject: Function) => {
      await firstValueFrom(this.firestore.collection('channels').doc(this.dataService.currentUser.currentChannelId).get()).then(doc => {
        if (doc.exists) {
          this.members = doc.get('members');
          resolve();
        }
        else {
          console.log('Error getting members');
          reject();
        }
      })});
    } 

  removeMember(userId: string) {
    this.getUserAndChannel(userId);
    this.deleteChannelAtUser();
    this.deleteUserAtChannel();
    this.updateChannelandUserData();
    this.dialogRef.close();
  }

  updateChannelandUserData() {
    if(this.dataService.instance === 'channel') {
      console.log('channel: ', this.channel, 'User: ', this.user);
      this.firestore
      .collection('channels')
      .doc(this.dataService.currentUser.currentChannelId)
      .update(this.channel.toJSON());
      this.firestore
      .collection('users')
      .doc(this.user.currentUserId)
      .update(this.user.toJSON());
    }
  }

  getUserAndChannel(userId: string) {
    this.user = new User(this.dataService.users.find(x => x.currentUserId === userId) as IUser);
    this.channel = this.dataService.currentInstance;
  }

  deleteUserAtChannel() {
    this.IndexOfUserToDeleteInChannel = this.channel.members.indexOf(this.user.currentUserId);
    this.channel.members.splice(this.IndexOfUserToDeleteInChannel, 1);
  }

  deleteChannelAtUser() {
    this.IndexOfChannelToDeleteInUser = this.user.memberInChannel.indexOf(this.dataService.currentUser.currentChannelId);
    this.user.memberInChannel.splice(this.IndexOfChannelToDeleteInUser, 1)
  }
} 
