import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { User } from '../models/user.class';
import { DataService } from '../services/data.service';
import { Channel } from '../models/channel.class';

// import { firestore } from '@firebase/firestore-types';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {
  options: User[] = [];
  searchInput: string;
  myControl = new FormControl<string | User>('');
  filteredOptions: Observable<User[]>;
  user: User; 
  channel: Channel = new Channel();

  constructor(
    private firestore: AngularFirestore,
    private dataService: DataService,
    ) { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
    this.getOptionsFromCollection();
  }

  async addUserToChannel(name: string) {
    this.user = new User(this.dataService.users.find(x => x.name === name));
    this.getChannel();
    this.user.memberInChannel.push(this.dataService.currentUser.currentChannelId)
    this.updateChannel();
    this.updateUser();
  }

  updateUser() {
    this.firestore
    .collection('users')
    .doc(this.user.currentUserId)
    .update(this.user.toJSON())
  }

  updateChannel() {
    this.firestore
   .collection('channels')
   .doc(this.dataService.currentUser.currentChannelId)
   .update(this.channel.toJSON());
  }

  async getChannel() {
    const snapshot = await this.firestore
    .collection('channels')
    .doc(this.dataService.currentUser.currentChannelId)
    .get()
    .toPromise();
    if (snapshot.exists) {
        this.channel = snapshot.data() as Channel;
    }
    else {
      console.log('error: Channel not found');
    }
  }



  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  async getOptionsFromCollection() {
    const users = await this.firestore
      .collection<User>('users')
      .get()
      .toPromise();

    this.options = [];

    users.forEach((doc) => {
      this.options.push(doc.data() as User);
    });
  }
}

