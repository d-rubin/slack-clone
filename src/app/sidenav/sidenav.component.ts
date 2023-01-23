import { Component, OnInit } from '@angular/core';
import { ChannelDialogComponent } from '../channel-dialog/channel-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { ConversationDialogComponent } from '../conversation-dialog/conversation-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Channel } from '../models/channel.class';
import { Conversation } from '../models/Conversation.class';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DataService } from '../services/data.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  providers: [DataService],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translateX(0%)',
        })
      ),
      state(
        'out',
        style({
          transform: 'translateX(100%)',
        })
      ),
      transition('in => out', animate('1000ms ease-in-out')),
      transition('out => in', animate('1000ms ease-in-out')),
    ]),
  ],
})
export class SidenavComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public firestore: AngularFirestore,
    public dataService: DataService
  ) {}

  panelOpenState: boolean;
  allChannels: Channel[] = [];
  allConversations: Conversation[] = [];
  conversation: Conversation = new Conversation();
  channel: Channel = new Channel();
  email: string;
  name: string;
  partnerName: string;
  partnerEmail: string;
  menu: boolean = true;
  icon: string = 'menu';
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
    this.getConversationsWithId();
  }
  // Get Email of Current User
  getCurrentUserEmail() {
    return new Promise((resolve: Function, reject: Function) => {
      onAuthStateChanged(getAuth(), (currentuser) => {
        this.email = currentuser.email;
        resolve();
      });
    });
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
        for (let i = 0; i < channels.length; i++) {
          this.allChannels.push(channels[i]);
        }
      });
  }

  getConversationsWithId() {
    return this.firestore
      .collection<any>('conversations', (ref) =>
        ref.where('members', 'array-contains-any', [
          this.dataService.currentUserId,
        ])
      )
      .valueChanges()
      .subscribe((converatons: Conversation[]) => {
        this.allConversations = [];
        for (let i = 0; i < converatons.length; i++) {
          this.allConversations.push(converatons[i]);
        }
      });
  }

  showMenu() {
    if (this.menu) {
      this.menu = false;
      this.icon = 'close';
    } else {
      this.menu = true;
      this.icon = 'menu';
    }
  }

  /**
   * Navigate or show this channel in app-channle-room
   * @param channelId 
   */
  showContent(channelId: string) {
    this.firestore
      .collection('users')
      .doc(this.currentUserIdFirestore)
      .update({ currentChannelId: `${channelId}` });
  }

  openChannelDialog() {
    this.dialog.open(ChannelDialogComponent);
  }

  openConversationDialog() {
    this.dialog.open(ConversationDialogComponent);
  }

  // Search in a Collection for a Variable
  getUserIdfromCurrentUser() {
    this.firestore
      .collection<any>('users', (ref) => ref.where('name', '==', 'Gruppe413'))
      .get()
      .subscribe((docs) => {
        docs.forEach((doc) => {});
      });
  }
}
