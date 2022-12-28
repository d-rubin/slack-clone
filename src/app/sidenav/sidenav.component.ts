import { Component, OnInit } from '@angular/core';
import { ChannelDialogComponent } from '../channel-dialog/channel-dialog.component';
import { MatDialog } from "@angular/material/dialog";
import { ConversationDialogComponent } from '../conversation-dialog/conversation-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Channel } from '../models/channel.class';
import { doc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  panelOpenState: boolean;
  // userId: string;
  allChannels: [] = [];
  channel: Channel = new Channel();

  constructor(
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
  }

  openChannelDialog() {
    this.dialog.open(ChannelDialogComponent);
  }

  openConversationDialog() {
    this.dialog.open(ConversationDialogComponent);
  }
}
