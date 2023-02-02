import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberComponent } from '../add-member/add-member.component';
import { Channel } from '../models/channel.class';
import { Conversation } from '../models/Conversation.class';
import { DataBase } from '../services/data.service';
import { ShowMembersComponent } from '../show-members/show-members.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chatbox-menu',
  templateUrl: './chatbox-menu.component.html',
  styleUrls: ['./chatbox-menu.component.scss'],
})
export class ChatboxMenuComponent implements OnInit {
  name: string;
  channel: Boolean;
  memberCount: number;
  public id: string;
  channelName = 'Loading...';
  numberOfMember = 0;

  constructor(
    public dialog: MatDialog,
    public dataService: DataBase,
    public firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.updateHeaderInformations();
  }

  /**
   * When the route changes, get the id from the route params, then use that id to get the channel name
   * for the header.
   */
  async updateHeaderInformations() {
    this.route.params.subscribe(async (params) => {
      this.id = params['id'];
      let docRef = this.setDocRef(this.id);
      this.getChannelNameForHeader(docRef);
      this.getNumberOfMembers(docRef);
    });
  }

  /**
   * This function takes an id as an argument and returns a reference to the document with that id in
   * the channels collection.
   * @param id - the id of the channel
   * @returns A reference to the document with the id of the channel.
   */
  setDocRef(id: string) {
    return this.firestore.collection('channels').doc(`${id}`);
  }

  /**
   * It subscribes to the valueChanges observable of the docRef, and then assigns the value of the 'name'
   * property of the doc to the channelName variable.
   * @param docRef - A reference to the document in the database.
   */
  getChannelNameForHeader(docRef: AngularFirestoreDocument<unknown>) {
    /* Subscribing to the valueChanges observable of the docRef. */
    docRef.valueChanges().subscribe(async (doc) => {
      this.channelName = await doc['name'];
    });
  }

/**
 * It gets the number of members in a group.
 * @param docRef - AngularFirestoreDocument<unknown>
 */
  getNumberOfMembers(docRef: AngularFirestoreDocument<unknown>) {
    docRef.valueChanges().subscribe(async (doc) => {
      this.numberOfMember = await doc['members'].length;
    });
  }

  showMembers() {
    this.dialog.open(ShowMembersComponent);
  }

  addUserToChannel() {
    this.dialog.open(AddMemberComponent);
  }
}
