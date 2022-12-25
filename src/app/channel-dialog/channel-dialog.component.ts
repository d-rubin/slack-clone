import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-channel-dialog',
  templateUrl: './channel-dialog.component.html',
  styleUrls: ['./channel-dialog.component.scss']
})
export class ChannelDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChannelDialogComponent>, 
    // public firestore: AngularFirestore
    ) { }

  channelName: string;

  ngOnInit(): void {
  }

  createChannel() {
    // this.firestore
    // .collection('channels')
    // .add(this.channelName)
    // .then(() => {
    //   this.dialogRef.close();
    // });
  }
}
