import { Component, OnInit } from '@angular/core';
import { ChannelDialogComponent } from '../channel-dialog/channel-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { ConversationDialogComponent } from '../conversation-dialog/conversation-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Channel } from '../models/channel.class';
import { Conversation } from '../models/Conversation.class';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  providers: [DataService],
})
export class SidenavComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public firestore: AngularFirestore,
    public dataService: DataService,
    private router: Router
  ) {}

  panelOpenState: boolean;
  allChannels = [];
  allConversations = [];
  conversation: Conversation = new Conversation();
  channel: Channel = new Channel();
  email: string;
  name: string;
  partnerName: string;
  partnerEmail: string;
  currentUser: Object;
  currentUserEmail: any;
  currentUserIdFirestore: any;
  currentMemberInChannel: any;
  currentMemberInData: any;

  async ngOnInit() {
    await this.getCurrentUserId();
    this.renderChannelsAndConversations();
  }

  async getCurrentUserId() {
    this.currentUserEmail = await this.dataService.onAuthStateChanged();
    this.currentUserIdFirestore = await this.dataService.getCurrentUserID();
    await this.getArrayChannelMember();
  }

  async getArrayChannelMember() {
    const docRef = this.firestore
      .collection('users')
      .doc(this.currentUserIdFirestore);
    docRef.valueChanges().subscribe(async (doc) => {
      this.currentMemberInChannel = await doc;
    });
  }

  renderChannelsAndConversations() {
    this.getChannelsWithId();
  }

  getChannelsWithId() {
    return this.firestore
      .collection<any>('channels', (ref) =>
        ref.where('members', 'array-contains-any', [
          this.dataService.currentUserId,
        ])
      )
      .valueChanges()
      .subscribe((channels: Channel[]) => {
        this.allChannels = [];
        this.allConversations = [];
        for (let i = 0; i < channels.length; i++) {
          let sortType = channels[i].type;
          if (sortType === 'channel') {
            this.allChannels.push(channels[i]);
          } else {
            this.allConversations.push(channels[i]);
          }
        }
      });
  }

  /**
   * Navigate or show this channel in app-channle-room
   * @param Id The Id of the Instance
   */
  showContent(Id: string) {
    this.firestore
      .collection('users')
      .doc(this.currentUserIdFirestore)
      .update({ currentChannelId: `${Id}` });
    this.router.navigateByUrl('/mainarea/' + Id);
  }

  openChannelDialog() {
    this.dialog.open(ChannelDialogComponent);
  }

  openConversationDialog() {
    this.dialog.open(ConversationDialogComponent);
  }
}
