import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ChannelDialogComponent } from '../channel-dialog/channel-dialog.component';
import { MatDialog } from "@angular/material/dialog";
import { ConversationDialogComponent } from '../conversation-dialog/conversation-dialog.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  panelOpenState: boolean;
  userId: string; 

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    onAuthStateChanged(getAuth(), (user) => {
      this.userId = user.uid;
      console.log(this.userId);
    });
  }

  openChannelDialog() {
    this.dialog.open(ChannelDialogComponent);
  }

  openConversationDialog() {
    this.dialog.open(ConversationDialogComponent);
  }
}
