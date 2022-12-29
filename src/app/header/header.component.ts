import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ChannelDialogComponent } from '../channel-dialog/channel-dialog.component';
import { ConversationDialogComponent } from '../conversation-dialog/conversation-dialog.component';
import { Channel } from '../models/channel.class';
import { SidenavComponent } from '../sidenav/sidenav.component';

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
  menu: boolean = true;
  icon: string = 'menu';

  constructor(public dialog: MatDialog, private firestore: AngularFirestore) {}

  ngOnInit(): void {
  }

  showMenu() {
    if(this.menu) {
      this.menu = false;
      this.icon = 'close';
    }
    else {
      this.menu = true;
      this.icon = 'menu';
    }
  }

  openChannelDialog() {
    this.dialog.open(ChannelDialogComponent);
  }

  openConversationDialog() {
    this.dialog.open(ConversationDialogComponent);
  }
}
