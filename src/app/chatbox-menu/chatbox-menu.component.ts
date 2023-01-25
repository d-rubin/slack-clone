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
  data;

  constructor(
    public dialog: MatDialog,
    public dataService: DataService,
    public firestore: AngularFirestore,
  ) {}

  async ngOnInit() {
    this.dataService.currentInstance$.subscribe((data) => {
      this.data = data;
    })
    console.log(this.data);
    this.name = this.dataService.currentInstance.name;
    if(this.dataService.instance === 'channel') {
      this.channel = true;
      this.memberCount = this.dataService.currentInstance.members.length;
    }
    else {
      this.channel = false;
    }
  }

  showMembers() {
    this.dialog.open(ShowMembersComponent);
  }

  addUserToChannel() {
    this.dialog.open(AddMemberComponent);
  }
}
