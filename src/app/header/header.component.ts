import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ChannelDialogComponent } from '../channel-dialog/channel-dialog.component';
import { ConversationDialogComponent } from '../conversation-dialog/conversation-dialog.component';
import { Channel } from '../models/channel.class';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  panelOpenState: boolean;
  userId: string;
  allChannels: [] = [];
  channel: Channel = new Channel();

  constructor(public dialog: MatDialog, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.firestore
      .collection('channels')
      .valueChanges({ idField: 'ID' })
      .subscribe((changes: any) => {
        this.allChannels = changes;
      });
  }

  openChannelDialog() {
    this.dialog.open(ChannelDialogComponent);
  }

  openConversationDialog() {
    this.dialog.open(ConversationDialogComponent);
  }
}
