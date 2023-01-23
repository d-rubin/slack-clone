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
import { Conversation } from '../models/Conversation.class';
import { ConnectableObservable } from 'rxjs';

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
    await this.dataService.ngOnInit();
    console.log(this.dataService.currentInstance);
      this.name = this.dataService.currentInstance.name;
      this.memberCount = this.dataService.currentInstance.members.length;
    if(this.dataService.instance === 'chanlel') {
      this.channel = true;
      console.log('Channel is True');
    }
    else {
      this.channel = false;
      console.log('channel is false');
      console.log(this.dataService.instance);
    }
    // await this.dataService.getDataInterval();
    // await new Promise((resolve: Function, reject: Function) => {
    //   if (this.dataService.currentUser) {
    //     this.dataService.checkTypeOfDocId(
    //       this.dataService.currentUser.currentChannelId
    //     );
    //     resolve();
    //   }
    // });
  }

  // getChannelData() {
  //   setInterval(() => {
  //     if (this.dataService.instance === 'channel') {
  //       this.getChannelData();
  //       this.channel = true;
  //       this.name = this.dataService.currentInstance.name;
  //       this.members = this.dataService.currentInstance.members;
  //       this.badgenumber = this.dataService.currentInstance.members.length;
  //       console.log('This.channel = true');
  //     } else {
  //       this.channel = false;
  //       console.log('This.channel = false');
  //     }
  //   }, 1000);
  // }

  showMembers() {
    this.dialog.open(ShowMembersComponent);
  }

  addUserToChannel() {
    this.dialog.open(AddMemberComponent);
  }
}
