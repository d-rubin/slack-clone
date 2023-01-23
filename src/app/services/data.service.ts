import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { User, IUser } from '../models/user.class';
import { Observable, of } from 'rxjs';
import { Channel, IChannel } from '../models/channel.class';
import { IconOptions } from '@angular/material/icon';
import { Conversation, IConversation } from '../models/Conversation.class';
import { ActivatedRoute, Route } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class DataService implements OnInit {
  //declare var to find the firestore id current user
  currentUserEmail: any;
  currentUserId: any;
  reaponseUserIdStatus200 = false;
  users: User[] = [];
  uploadableUser: User;
  currentInstance: Channel | Conversation;
  instance: string;
  instanceId: string;
  currentSubscription: any;

  // declare an observable that will be used to subscribe to the currentUser$ observable
  currentUser: User;
  currentUser$: Observable<typeof this.currentUser>;

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {
    this.ngOnInit();
  }

  async ngOnInit() {
    this.currentUserEmail = await this.onAuthStateChanged();
    this.currentUserId = await this.getCurrentUserID();
    await this.getCurrentUserData();
    await this.getAllUserData();
    this.instance = await this.checkTypeOfDocId(this.currentUser.currentChannelId);
    this.getInstanceId();
    this.subscribeInstance(this.instanceId);
    console.log('current Instance in ngOnInit: ', this.currentInstance);
  }

  getInstanceId() {
    this.route.params.subscribe(params => {
      this.instanceId = params['id'];
    })
  }

  /**
   * Subscribes the current activated Route
   * @param instanceId The Id of the document
   */
  subscribeInstance(instanceId: string) {
      if (this.currentSubscription) {
        this.currentSubscription.unsubscribe();
      }
      if (this.instance === 'channel') {
        this.currentSubscription = this.firestore
          .collection('channels')
          .doc(instanceId)
          .valueChanges()
          .subscribe(channel => {
            this.currentInstance = new Channel(channel as IChannel);
            console.log('currentInstance in function: ', this.currentInstance);
          });
        }
      else {
        this.currentSubscription = this.firestore
          .collection('conversations')
          .doc(instanceId)
          .valueChanges()
          .subscribe((conversation) => {
            this.currentInstance = new Conversation(conversation as IConversation);
          });
      }
  }
  

  /**
   * Checks if the currentChannelId is a Channel or a Conversation
   * @param id The id of the Document
   */
  async checkTypeOfDocId(id: string): Promise<string>{
    const doc = await this.firestore
      .collection('channels')
      .doc(`${id}`)
      .ref.get()
    if (doc) {
      return 'channel';
    } else {
      return 'conversation';
    }
  }

  updateCurrentUserObservable() {
    this.currentUser$ = of(this.currentUser);
    this.currentUser$.subscribe();
  }

  updateUserData() {
    this.uploadableUser = new User(this.currentUser);
    this.uploadableUser.currentUserId = this.currentUserId;
    this.updateUser();
  }

  updateUser() {
    this.firestore
      .collection('users')
      .doc(this.currentUserId)
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
          this.reaponseUserIdStatus200 = true;
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
    this.firestore
      .collection('users')
      .doc(this.currentUserId)
      .valueChanges()
      .subscribe((doc) => {
        if (doc) {
          this.updateCurrentUserObservable();
          this.currentUser = new User(doc as IUser);
        }
      });
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

  async getDataInterval() {
    let getDataIntervalStop = setInterval(() => {
      if (this.reaponseUserIdStatus200) {
        clearInterval(getDataIntervalStop);
      }
    }, 100);
    return true;
  }
}
