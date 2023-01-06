import { Component, OnInit } from '@angular/core';
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
  name: string;
  members: number = 15;
  currentUserIdFirestore: any;
  currentUserEmail: any;
  currentUser: any;

  constructor(
    public dialog: MatDialog,
    public dataService: DataService
    ) {

    }

  async ngOnInit() {
    this.currentUserEmail = await this.dataService.onAuthStateChanged();
    this.currentUserIdFirestore = await this.dataService.getCurrentUserID();
    this.currentUser = await this.dataService.getCurrentUserData();
    this.currentUser.currentUserId = this.currentUserIdFirestore;
    console.log(this.currentUser)
  }

  showMembers() {
    this.dialog.open(ShowMembersComponent);
  }

  addUserToChannel() {
    this.dialog.open(AddMemberComponent);
  }
}
