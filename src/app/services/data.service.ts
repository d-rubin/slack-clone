import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { User, IUser } from '../models/user.class';
import { Observable, of } from 'rxjs';
import { Channel, IChannel } from '../models/channel.class';

@Injectable({
  providedIn: 'root',
})
export class DataService implements OnInit {
  //declare var to find the firestore id current user
  currentUserEmail: any;
  currentUserIdFirestore: any;
  users: User[] = [];
  uploadableUser: User;
  currentChannel: Channel;

  // declare an observable that will be used to subscribe to the currentUser$ observable
  currentUser: User;
  currentUser$: Observable<typeof this.currentUser>;

  constructor(private firestore: AngularFirestore) {
    this.ngOnInit();
  }

  async ngOnInit() {
    this.currentUserEmail = await this.onAuthStateChanged();
    this.currentUserIdFirestore = await this.getCurrentUserID();
    await this.getCurrentUserData();
    await this.getAllUserData();
    this.updateUserData();
    this.getChannelData();
  }

  getChannelData() {
    this.firestore
      .collection('channels')
      .doc(this.currentUser.currentChannelId)
      .valueChanges()
      .subscribe((doc: IChannel) => {
        this.currentChannel = new Channel(doc);
        console.log('Current Channel is: ',this.currentChannel);
      });
  }

  updateCurrentUserObservable() {
    this.currentUser$ = of(this.currentUser);
    this.currentUser$.subscribe();
  }

  updateUserData() {
    this.uploadableUser = new User(this.currentUser);
    this.uploadableUser.currentUserId = this.currentUserIdFirestore;
    this.updateUser();
  }

  updateUser() {
    this.firestore
      .collection('users')
      .doc(this.currentUserIdFirestore)
      .update(this.uploadableUser.toJSON());
  }

  /**
   * find out EMAIL from the currently logged-in user
   *
   * @returns current user email as string
   */
  async onAuthStateChanged() {
    return new Promise((resolve, reject) => {
      try {
        onAuthStateChanged(getAuth(), (user) => {
          if (user) {
            resolve(user.email);
          } else {
          }
        });
      } catch {
        () => reject('onAuthStateChanged() was FAIL');
      }
    });
  }

  /**
   *find out ID-FIRESTORE from the currently logged-in user
   *
   * @returns firestore user id as string
   */
  async getCurrentUserID() {
    return new Promise((resolve, reject) => {
      try {
        let query = this.firestore.collection('users', (ref) =>
          ref.where('email', '==', this.currentUserEmail)
        );
        query.get().subscribe((querySnapshot) => {
          let docId = querySnapshot.docs[0].id;
          resolve(docId);
        });
      } catch {
        () => reject('currentUserIdFirestore() WAS FAIL!');
      }
    });
  }

  /**
   * get all DATA-USER-FIRESTORE from the currently logged-in user
   *
   * @returns firestore user data as JSON
   */
  async getCurrentUserData() {
    this.firestore.collection('users')
     .doc(this.currentUserIdFirestore)
     .valueChanges()
     .subscribe((doc) => {
      if(doc) {
        this.updateCurrentUserObservable();
        this.currentUser = new User(doc as IUser);
        console.log('Current user is: ',  this.currentUser)
      }
     })
  }

  async getAllUserData() {
    return new Promise((resolve: Function, reject: Function) => {
      try {
        this.firestore
          .collection('users')
          .get()
          .subscribe((snapschot) => {
            this.users = snapschot.docs.map(
              (doc) => new User(doc.data() as IUser)
            );
            resolve();
          });
      } catch (error) {
        reject('getAllUserData() WAS FAIL!');
      }
    });
  }
}
