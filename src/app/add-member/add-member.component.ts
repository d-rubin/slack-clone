import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.class';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {
  options: User[] = [];
  searchInput: string;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
  }

  async searchUsers() {
    const searchTerm = this.searchInput;
    const users = await this.firestore
      .collection<any>('users')
      .ref
      .where('name', '==', searchTerm)
      .get();
    users.forEach((user: any) => {
      this.options.push(user.data as User)
    });
  }
  

}
