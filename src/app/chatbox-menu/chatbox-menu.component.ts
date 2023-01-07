import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberComponent } from '../add-member/add-member.component';
import { User } from '../models/user.class';
import { DataService } from '../services/data.service';
import { ShowMembersComponent } from '../show-members/show-members.component';

@Component({
  selector: 'app-chatbox-menu',
  templateUrl: './chatbox-menu.component.html',
  styleUrls: ['./chatbox-menu.component.scss']
})
export class ChatboxMenuComponent implements OnInit {
  name: string = 'default';
  members: string[];
  badgenumber: number;
  currentUserIdFirestore: any;
  currentUserEmail: any;
  currentUser: any;

  constructor(
    public dialog: MatDialog,
    public dataService: DataService,
    public firestore: AngularFirestore
    ) {

    }

  async ngOnInit() {
    this.currentUserEmail = await this.dataService.onAuthStateChanged();
    this.currentUserIdFirestore = await this.dataService.getCurrentUserID();
    this.currentUser = await this.dataService.getCurrentUserData();
    this.currentUser.currentUserId = this.currentUserIdFirestore;
    this.getChannelInfo();
  }

  getChannelInfo() {
    this.firestore.collection('channels').doc(this.currentUser.currentChannelId).get().toPromise().then(doc => {
      if (doc.exists) {
        this.name = doc.get('name');
        this.members = doc.get('members');
        this.badgenumber = this.members.length;
      } else {
        console.log('Document does not exist');
      }
    });
  }
  
  

  showMembers() {
    this.dialog.open(ShowMembersComponent);
  }

  addUserToChannel() {
    this.dialog.open(AddMemberComponent);
  }
}
