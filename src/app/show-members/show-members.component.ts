import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.class';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-show-members',
  templateUrl: './show-members.component.html',
  styleUrls: ['./show-members.component.scss']
})
export class ShowMembersComponent implements OnInit {
  members: [] = [];
  currentUser: any;
  currentUserIdFirestore: any;
  users: User[] = [];

  constructor(
    private firestore: AngularFirestore,
    public dataService: DataService,
    ) { }

  async ngOnInit() {
    this.currentUserIdFirestore = await this.dataService.getCurrentUserID();
    this.currentUser = await this.dataService.getCurrentUserData();
    await this.getMembersOfChannel();
    await this.getUsers();
  }

  getMembersOfChannel() {
    return new Promise (async (resolve: Function, reject: Function) => {
      await this.firestore.collection('channels').doc(this.currentUser.currentChannelId).get().toPromise().then(doc => {
        if (doc.exists) {
          this.members = doc.get('members');
          resolve();
        }
        else {
          console.log('Error getting members');
          reject();
        }
      })});
    } 

  getUsers() {
    return new Promise(async (resolve: Function, reject: Function) => {
      for(let member of this.members) {
        const user = await this.firestore.collection<any>('users').doc(member).get().toPromise();
        this.users.push(user.data());
      }
      resolve();
    });
  }
} 
