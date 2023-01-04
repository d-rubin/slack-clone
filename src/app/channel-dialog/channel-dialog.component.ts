import { Component, OnInit, ɵisPromise } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Channel } from '../models/channel.class';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-channel-dialog',
  templateUrl: './channel-dialog.component.html',
  styleUrls: ['./channel-dialog.component.scss'],
})
export class ChannelDialogComponent implements OnInit {
  channelName: string;
  channel: Channel = new Channel();
  userEmail: any;
  currentUserId: any;
  currentUserDataFromDB: any;

  constructor(
    public dialogRef: MatDialogRef<ChannelDialogComponent>,
    private firestore: AngularFirestore
  ) {}

  async ngOnInit() {
    await this.onAuthStateChanged();
    await this.getCurrentUserID();
    await this.getCurrentUserDataFromDB();
    console.log('Out of Function', this.currentUserDataFromDB);
  }

  createChannel() {
    this.channel.name = this.channelName;
    this.channel.members.push(this.userEmail);
    this.firestore
      .collection('channels')
      .add(this.channel.toJSON())
      .then((doc) => {
        console.log(doc.id);
        this.dialogRef.close();
      });
  }

  async onAuthStateChanged() {
    return new Promise((resolve, reject) => {
      try {
        onAuthStateChanged(getAuth(), (user) => {
          resolve((this.userEmail = user.email));
        });
      } catch {
        () => reject(console.warn('onAuthStateChanged() was FAIL'));
      }
    });
  }

  async getCurrentUserID() {
    return new Promise((resolve, reject) => {
      try {
        this.firestore
          .collection('users', (ref) =>
            ref.where('email', '==', this.userEmail)
          )
          .snapshotChanges()
          .subscribe((data) => {
            data.forEach((doc) => {
              resolve((this.currentUserId = doc.payload.doc.id));
            });
          });
      } catch {
        () => reject(console.warn('getCurrentUserID() was FAIL'));
      }
    });
  }

  async getCurrentUserDataFromDB() {
    return new Promise((resolve, reject) => {
      try {
        this.firestore
          .collection('users')
          .doc(this.currentUserId)
          .valueChanges()
          .subscribe((doc) => resolve((this.currentUserDataFromDB = doc)));
      } catch {
        () => reject(console.warn('getCurrentUserDataFromDB() was FAIL'));
      }
    });
  }

  // Muster Promise
  // function makeRequest() {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       const response = HIER FUNKTION! sendRequestToServer();
  //       resolve(response);
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }
}
