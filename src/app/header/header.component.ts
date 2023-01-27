import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { AuthenticationService } from 'src/services/authentication.service';
import { Channel } from '../models/channel.class';
import { User } from '../models/user.class';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';

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
  name: unknown = 'please login';

  constructor(
    public dialog: MatDialog,
    private firestore: AngularFirestore,
    private authService: AuthenticationService,
    private router: Router,
    public dataService: DataService
  ) {}

  async ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
    this.getOptionsFromCollections();
    this.name = await this.onAuthStateChanged();
  }

  showMenu() {
    if(this.dataService.icon === 'menu') {
      this.dataService.icon = 'close';
      this.dataService.menu = true;
    }
    else {
      this.dataService.icon = 'menu';
      this.dataService.menu = false;
    }
  }

  async onAuthStateChanged() {
    return new Promise((resolve, reject) => {
      try {
        onAuthStateChanged(getAuth(), (user) => {
          if (user) {
            resolve(user.displayName);
          } else {
          }
        });
      } catch {
        () => reject('onAuthStateChanged() was FAIL');
      }
    });
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  async getOptionsFromCollections() {
    const users = await this.firestore
      .collection<User>('users')
      .get()
      .toPromise();
    const channels = await this.firestore
      .collection<Channel>('channels')
      .get()
      .toPromise();

    this.options = [];

    users.forEach((doc) => {
      this.options.push(doc.data() as User);
    });

    channels.forEach((channel) => {
      this.options.push(channel.data() as Channel);
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  }
}
