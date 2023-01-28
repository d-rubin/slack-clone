import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberComponent } from '../add-member/add-member.component';
import { Channel } from '../models/channel.class';
import { Conversation } from '../models/Conversation.class';
import { DataService } from '../services/data.service';
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

  constructor(
    public dialog: MatDialog,
    public dataService: DataService,
    public firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.getChannelIdFromURL();

    setTimeout(() => {
      this.name = this.dataService.currentInstance.name;
      this.memberCount = this.dataService.currentInstance.members.length;
      if (this.dataService.instance === 'channel') {
        this.channel = true;
      } else {
        this.channel = false;
      }
    }, 2000);

    await this.getCurrentChannelName();
  }

  async getChannelIdFromURL() {
    this.route.params.subscribe(async (params) => {
      this.id = params['id'];
      let docRef = this.firestore.collection('channels').doc(`${this.id}`);
      docRef.valueChanges().subscribe(async (doc) => {
        this.channelName = await doc['name'];
      });
    });
  }

  async getCurrentChannelName() {
    let userRef = this.firestore
      .collection('user')
      .doc(await this.dataService.currentUserId)
      .valueChanges()
      .subscribe((data) => {
        let returnValue = data;
        console.log(returnValue);
      });
  }

  showMembers() {
    this.dialog.open(ShowMembersComponent);
  }

  addUserToChannel() {
    this.dialog.open(AddMemberComponent);
  }
}
