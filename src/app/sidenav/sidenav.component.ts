import { Component, Input, OnInit } from '@angular/core';
import { ChannelDialogComponent } from '../channel-dialog/channel-dialog.component';
import { MatDialog } from "@angular/material/dialog";
import { ConversationDialogComponent } from '../conversation-dialog/conversation-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Channel } from '../models/channel.class';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import * as firebase from 'firebase/compat';
import { Conversation } from '../models/Conversation.class';
import { first } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
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
  @Input() isOpen: boolean = true;

  constructor(
    public dialog: MatDialog,
    public firestore: AngularFirestore
    ) { }

  ngOnInit(): void {
    this.renderChannelsAndConversations();

  }

  async renderChannelsAndConversations() {
    await this.getCurrentUserEmail();
    this.getChannelsWithEmail();
    this.getConversationsWithEmail();
  }

  getCurrentUserEmail() {
    return new Promise((resolve: Function, reject: Function) => {
      onAuthStateChanged(getAuth(), (currentuser) => {
        this.email = currentuser.email;
        resolve();
      });
    })
  }

  getChannelsWithEmail() {
    return this.firestore
      .collection<any>('channels', ref => ref.where('members', 'array-contains-any', [this.email]))
      .valueChanges()
      .subscribe(
        (channels: Channel[]) => {
          this.allChannels = [];
          for (let i = 0; i < channels.length; i++) {
            this.allChannels.push(channels[i]);
          };
        }
      );
  }

  getConversationsWithEmail() {
    return this.firestore
      .collection<any>('conversations', ref => ref.where('members', 'array-contains-any', [this.email]))
      .valueChanges()
      .subscribe(
        (converatons: Conversation[]) => {
          this.allConversations = [];
          for (let i = 0; i < converatons.length; i++) {
              this.allConversations.push(converatons[i]);
            }
        }
      );
  }       

  openChannelDialog() {
    this.dialog.open(ChannelDialogComponent);
  }

  openConversationDialog() {
    this.dialog.open(ConversationDialogComponent);
  }
}
