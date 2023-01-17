import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { doc } from 'firebase/firestore';
import { AddMemberComponent } from '../add-member/add-member.component';
import { User } from '../models/user.class';
import { DataService } from '../services/data.service';
import { ShowMembersComponent } from '../show-members/show-members.component';
import { DocumentSnapshot } from 'firebase/firestore';
import { Channel } from '../models/channel.class';

@Component({
  selector: 'app-chatbox-menu',
  templateUrl: './chatbox-menu.component.html',
  styleUrls: ['./chatbox-menu.component.scss']
})
export class ChatboxMenuComponent implements OnInit {
  name: string;
  members: string[];
  badgenumber: number;


  constructor(
    public dialog: MatDialog,
    public dataService: DataService,
    public firestore: AngularFirestore
    ) {

    }

  async ngOnInit() {
    setInterval(() => {
      this.getChannelData();
    },500);
  }

  // Variables are not updated when currentChannel is updated
  getChannelData() {
    if(this.dataService.currentChannel) {
      this.name = this.dataService.currentChannel.name;
      this.members = this.dataService.currentChannel.members;
      this.badgenumber = this.dataService.currentChannel.members.length;
    }
  }

  showMembers() {
    this.dialog.open(ShowMembersComponent);
  }

  addUserToChannel() {
    this.dialog.open(AddMemberComponent);
  }
}
