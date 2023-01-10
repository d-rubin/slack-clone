import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { User } from '../models/user.class';
import { Subject } from 'rxjs';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService implements OnInit {
  //declare var to find the firestore id current user
  currentUserEmail: any;
  currentUserIdFirestore: any;
  users: any[] = [];

  // declare an observable that will be used to subscribe to the currentUser$ observable
  currentUser: any;
  currentUser$: Observable<typeof this.currentUser>;

  constructor(private firestore: AngularFirestore) {
    this.ngOnInit();
  }

  async ngOnInit() {
    this.currentUserEmail = await this.onAuthStateChanged();
    this.currentUserIdFirestore = await this.getCurrentUserID();
    this.currentUser = await this.getCurrentUserData();
    await this.getAllUserData();
  }

  updateCurrentUserObservable() {
    this.currentUser$ = of(this.currentUser);
    this.currentUser$.subscribe((val) => {
      console.log('NEW CURRENT USER DATA FROM FIREBASE WAS UPDATET', val);
    });
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
    return new Promise((resolve, reject) => {
      try {
        // get a reference to the current user document
        let docRef = this.firestore
          .collection('users')
          .doc(this.currentUserIdFirestore);

        // get the document data and save it to a component property

        docRef.valueChanges().subscribe((doc) => {
          if (doc) {
            this.updateCurrentUserObservable();
            console.log(doc);
            resolve(doc);
          } else {
            reject('getCurrentUserData() WAS FAIL!');
          }
        });
      } catch (error) {}
    });
  }

  async getAllUserData() {
    return new Promise((resolve: Function, reject: Function) => {
      try {
        this.firestore
          .collection('users')
          .get()
          .subscribe((snapshot) => {
            this.users = snapshot.docs.map((doc) => doc.data());
            console.log(this.users);
            resolve();
          });
      } catch (error) {
        reject('getAllUserData() WAS FAIL!');
      }
    });
  }
}
