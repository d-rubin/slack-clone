import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Channel, IChannel } from '../models/channel.class';
import { IUser, User } from '../models/user.class';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-show-members',
  templateUrl: './show-members.component.html',
  styleUrls: ['./show-members.component.scss']
})
export class ShowMembersComponent implements OnInit {
  members: [] = [];
  currentUser: any;
  currentUserIdFirestore: any;
  users: User[] = [];
  user: User;
  IndexOfUserToDeleteInChannel: number;
  IndexOfChannelToDeleteInUser: number;
  channel: Channel;

  constructor(
    private firestore: AngularFirestore,
    public dataService: DataService,
    private dialogRef: MatDialogRef<ShowMembersComponent>
    ) { }

  async ngOnInit() {
    this.currentUserIdFirestore = await this.dataService.getCurrentUserID();
    this.currentUser = await this.dataService.getCurrentUserData();
    await this.getMembersOfChannel();
    await this.getUsers();
  }

  getMembersOfChannel() {
    return new Promise (async (resolve: Function, reject: Function) => {
      await this.firestore.collection('channels').doc(this.currentUser.currentChannelId).get().toPromise().then(doc => {
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

  getUsers() {
    return new Promise(async (resolve: Function, reject: Function) => {
      for(let member of this.members) {
        const user = await this.firestore.collection<any>('users').doc(member).get().toPromise();
        this.users.push(user.data());
      }
      resolve();
    });
  }

  removeMember(memberName: string) {
    this.getUserAndChannel(memberName);
    this.deleteChannelAtUser();
    this.deleteUserAtChannel();
    this.updateChannelandUserData();
    this.dialogRef.close();
  }

  updateChannelandUserData() {
    console.log('channel: ', this.channel, 'User: ', this.user);
    this.firestore
    .collection('channels')
    .doc(this.channel.channelId)
    .update(this.channel.toJSON());
    this.firestore
    .collection('users')
    .doc(this.user.currentUserId)
    .update(this.user.toJSON());
  }

  getUserAndChannel(memberName: string) {
    this.user = new User(this.dataService.users.find(x => x.name === memberName) as IUser);
    this.channel = this.dataService.currentChannel;
  }

  deleteUserAtChannel() {
    this.IndexOfUserToDeleteInChannel = this.channel.members.indexOf(this.user.currentUserId);
    this.channel.members.splice(this.IndexOfUserToDeleteInChannel, 1);
  }

  deleteChannelAtUser() {
    this.IndexOfChannelToDeleteInUser = this.user.memberInChannel.indexOf(this.channel.channelId);
    this.user.memberInChannel.splice(this.IndexOfChannelToDeleteInUser, 1)
  }
} 
