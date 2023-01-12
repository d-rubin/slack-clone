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
  channel: Channel;

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
    this.user = this.dataService.users.find(x => x.name === name);
    await this.getChannel();
    this.user.memberInChannel.push(this.dataService.currentUser.currentChannelId)
    console.log('user: ', this.user, 'channel: ', this.channel)
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
   .update(this.channel.toJSON()); // Error:toJSON is not a function
  }

  getChannel() {
    return new Promise((resolve: Function, reject: Function) => {
      try {
        this.firestore
          .collection('channels')
          .doc(this.user.currentChannelId)
          .snapshotChanges()
          .pipe(
            map((snapshot) => {
              const data = snapshot.payload.data() as Channel
              return data;
            }))
            .subscribe(channel => {
              this.channel = channel;
              this.channel.members.push(this.user.currentUserId);
              resolve();
            })
      }
      catch (error) {
        reject(error);
      }
    })
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
