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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chatbox-menu',
  templateUrl: './chatbox-menu.component.html',
  styleUrls: ['./chatbox-menu.component.scss']
})
export class ChatboxMenuComponent implements OnInit {
  name: string;
  members: string[];
  badgenumber: number;
  channel: Boolean = false;

  constructor(
    public dialog: MatDialog,
    public dataService: DataService,
    public firestore: AngularFirestore,
    ) {

    }

  async ngOnInit() {
    await new Promise((resolve: Function, reject: Function) => {
      if(this.dataService.currentUser) {
        this.dataService.checkTypeOfDocId(this.dataService.currentUser.currentChannelId);
        resolve();
      }
    });
    this.getChannelData();
  }

  getChannelData() {
    setInterval(() => {
      if(this.dataService.instance === 'channel') {
        this.getChannelData();
        this.channel = true;
        this.name = this.dataService.currentInstance.name;
        this.members = this.dataService.currentInstance.members;
        this.badgenumber = this.dataService.currentInstance.members.length;
        console.log('This.channel = true')
      }
      else {
        this.channel = false;
        console.log('This.channel = false')
      }
    }, 1000);
  }

  showMembers() {
    this.dialog.open(ShowMembersComponent);
  }

  addUserToChannel() {
    this.dialog.open(AddMemberComponent);
  }
}
