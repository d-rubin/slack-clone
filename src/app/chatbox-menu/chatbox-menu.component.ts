import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberComponent } from '../add-member/add-member.component';
import { Channel } from '../models/channel.class';
import { Conversation } from '../models/Conversation.class';
import { DataService } from '../services/data.service';
import { ShowMembersComponent } from '../show-members/show-members.component';

@Component({
  selector: 'app-chatbox-menu',
  templateUrl: './chatbox-menu.component.html',
  styleUrls: ['./chatbox-menu.component.scss'],
})
export class ChatboxMenuComponent implements OnInit {
  name: string;
  channel: Boolean;
  memberCount: number;

  constructor(
    public dialog: MatDialog,
    public dataService: DataService,
    public firestore: AngularFirestore
  ) {}

  async ngOnInit() {
    setTimeout(() => {
      this.name = this.dataService.currentInstance.name;
      this.memberCount = this.dataService.currentInstance.members.length;
      if (this.dataService.instance === 'channel') {
        this.channel = true;
      } else {
        this.channel = false;
      }
    }, 2000);

    
    this.getCurrentChannelName();
  }

  async getCurrentChannelName() {
    let userRef = this.firestore
      .collection('user')
      .doc(await this.dataService.currentUserId)
      .valueChanges()
      .subscribe(async (data) => {
        let returnValue = await data;
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
