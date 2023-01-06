import { Component, OnInit, ɵisPromise } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Channel } from '../models/channel.class';
import { DataService } from '../services/data.service';
import { User } from '../models/user.class';

@Component({
  selector: 'app-channel-dialog',
  templateUrl: './channel-dialog.component.html',
  styleUrls: ['./channel-dialog.component.scss'],
  providers: [DataService],
})
export class ChannelDialogComponent implements OnInit {
  currentUser = new User();
  createNewChannel: Channel = new Channel();
  channelName = '';
  currentUserId: any;
  currentUserDataFromDB: any;
  newChannelID: any;

  constructor(
    public dialogRef: MatDialogRef<ChannelDialogComponent>,
    private firestore: AngularFirestore,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    //get current user data service
    setTimeout(async () => {
      this.currentUser = await this.dataService.currentUser;
      console.log(
        'AUSGABE DATA CHANNEL DIALOG! this.dataService.currentUser',
        this.currentUser
      );
    }, 1000);
  }

  async createChannel() {
    this.createNewChannel.name = this.channelName;
    this.createNewChannel.members.push(await this.currentUser.currentUserId);
    this.createNewChannel.adminChannel = this.currentUser.currentUserId;
    this.createNewChannel.messages = [];
    await this.getNewChannelID();
    this.currentUser.currentChannelId = await this.newChannelID;
    this.currentUser.memberInChannel.push(await this.newChannelID);
    await this.updateUserinFirestore(this.currentUser);
    this.dialogRef.close();
  }

  async updateUserinFirestore(currentUser) {
    const docRef = this.firestore.doc(`users/${currentUser.currentUserId}`);
    await docRef.update({
      name: currentUser.name,
      email: currentUser.email,
      currentUserId: currentUser.currentUserId,
      currentChannelId: currentUser.currentChannelId,
      memberInChannel: currentUser.memberInChannel,
    });
  }

  async getNewChannelID() {
    await this.firestore
      .collection('channels')
      .add(this.createNewChannel.toJSON())
      .then((doc) => {
        this.newChannelID = doc.id;
      });
  }

  async updateUserCurrentChallenId(
    currentUserId: string,
    newCurrentChannelId: string
  ) {
    const docRef = this.firestore.doc(`users/${currentUserId}`);
    docRef.update({ currentChannelId: newCurrentChannelId });
  }

  async updateUserIsMemberInChannelArray(
    currentUserId: string,
    newCurrentChannelId: string
  ) {
    const docRef = this.firestore.doc(`users/${currentUserId}`);
    let updateArray =
      this.currentUser.memberInChannel.push(newCurrentChannelId);
    docRef.update({ memberInChannel: updateArray });
  }
}
