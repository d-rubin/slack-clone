import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { ChannelDialogComponent } from '../channel-dialog/channel-dialog.component';
import { ConversationDialogComponent } from '../conversation-dialog/conversation-dialog.component';
import { Channel } from '../models/channel.class';
import { User } from '../models/user.class';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  panelOpenState: boolean;
  userId: string;
  allChannels: [] = [];
  channel: Channel = new Channel();
  myControl = new FormControl<string | User>('');
  options: any[] = [];
  filteredOptions: Observable<User[]>;

  constructor(public dialog: MatDialog, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    this.getOptionsFromCollections();
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  async getOptionsFromCollections() {
    const users = await this.firestore.collection<User>('users').get().toPromise();
    const channels = await this.firestore.collection<Channel>('channels').get().toPromise();

    this.options = [];

    users.forEach(doc => {
      this.options.push(doc.data() as User);
    });

    channels.forEach(channel => {
      this.options.push(channel.data() as Channel);
    });
  }
}
