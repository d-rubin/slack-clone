import { Component, OnInit } from '@angular/core';
import { ChannelDialogComponent } from '../channel-dialog/channel-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConversationDialogComponent } from '../conversation-dialog/conversation-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Channel } from '../models/channel.class';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Conversation } from '../models/Conversation.class';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DataService } from '../services/data.service';

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

  constructor(
    public dialog: MatDialog,
    public firestore: AngularFirestore,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    setTimeout(async () => {
      this.currentUser = await this.dataService.getCurrentUserData();
      console.log('this.dataService.getCurrentUserData()', this.currentUser);
    }, 1000);
    this.renderChannelsAndConversations();
  }

  async renderChannelsAndConversations() {
        //await this.getCurrentUserEmail();
    //this.getChannelsWithEmail();
    //this.getConversationsWithEmail();
  }

  // Get Email of Current User
  // getCurrentUserEmail() {
  //   return new Promise((resolve: Function, reject: Function) => {
  //     onAuthStateChanged(getAuth(), (currentuser) => {
  //       this.email = currentuser.email;
  //       resolve();
  //     });
  //   })
  // }

  //getChannelsWithEmail() {
  //  return this.firestore
  //    .collection<any>('channels', ref => ref.where('members', 'array-contains-any', [this.email]))
  //    .valueChanges()
  //    .subscribe(
  //      (channels: Channel[]) => {
  //        this.allChannels = [];
  //        for (let i = 0; i < channels.length; i++) {
  //          this.allChannels.push(channels[i]);
  //        };
  //      }
  //    );
  //}

  //getConversationsWithEmail() {
  //  return this.firestore
  //    .collection<any>('conversations', ref => ref.where('members', 'array-contains-any', [this.email]))
  //    .valueChanges()
  //    .subscribe(
  //      (converatons: Conversation[]) => {
  //        this.allConversations = [];
  //        for (let i = 0; i < converatons.length; i++) {
  //          this.allConversations.push(converatons[i]);
  //        }
  //      }
  //    );
  //}

  showMenu() {
    if (this.menu) {
      this.menu = false;
      this.icon = 'close';
    } else {
      this.menu = true;
      this.icon = 'menu';
    }
  }

  showContent(content: string) {}

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
