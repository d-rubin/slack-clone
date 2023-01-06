import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class DataService implements OnInit {
  currentUserEmail: any;
  currentUserIdFirestore: any;
  currentUser: any;

  constructor(private firestore: AngularFirestore) {
    this.ngOnInit();
  }

  async ngOnInit() {
    this.currentUserEmail = await this.onAuthStateChanged();
    this.currentUserIdFirestore = await this.getCurrentUserID();
    this.currentUser = await this.getCurrentUserData();
    this.currentUser.currentUserId = this.currentUserIdFirestore;
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
          resolve(user.email);
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
        // get a reference to the document
        let docRef = this.firestore
          .collection('users')
          .doc(this.currentUserIdFirestore);

        // get the document data and save it to a component property

        docRef.valueChanges().subscribe((doc) => {
          if (doc) {
            resolve(doc);
          } else {
            reject('getCurrentUserData() WAS FAIL!');
          }
        });
      } catch (error) {}
    });
  }
}
