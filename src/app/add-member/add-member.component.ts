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
  currentChannelId: string;
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

  addUserToChannel(name: string) {
    this.user = this.dataService.users.find(x => x.name === name);
    this.currentChannelId = this.user.currentChannelId;
    // this.firestore
    //   .collection('channels')
    //   .doc(this.currentChannelId).get().pipe()(channel) => {
    //     this.channel = channel.data();
    //     this.channel.members.push(name);
    // });
    // this.channel.members.pu

    // this.firestore
    //   .collection('channels')
    //   .doc(this.currentChannelId)
    //   .update(
    //     {
    //       members: firestore.FieldValue.arrayUnion(name)
    //     }
    //   )
      
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
