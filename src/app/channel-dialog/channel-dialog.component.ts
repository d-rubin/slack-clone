import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Channel } from '../models/channel.class';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-channel-dialog',
  templateUrl: './channel-dialog.component.html',
  styleUrls: ['./channel-dialog.component.scss']
})
export class ChannelDialogComponent implements OnInit {

  channelName: string;
  channel: Channel = new Channel();
  userEmail: string;

  constructor(
    public dialogRef: MatDialogRef<ChannelDialogComponent>, 
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    onAuthStateChanged(getAuth(), (user) => {
      this.userEmail = user.email;
    });
  }

  createChannel() {
    this.channel.name = this.channelName;
    this.channel.members.push(this.userEmail);
    this.firestore
    .collection('channels')
    .add(this.channel.toJSON())
    .then(() => {
      this.dialogRef.close();
    });
  }
}
