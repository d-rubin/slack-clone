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

@Injectable({
  providedIn: 'root',
})
export class DataService implements OnInit {
  //declare var to find the firestore id current user
  currentUserEmail: any;
  currentUserIdFirestore: any;
  reaponseUserIdStatus200 = false;
  users: User[] = [];
  uploadableUser: User;
  currentInstance: Channel | Conversation;
  instance: string;
  instanceId: string;

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
    this.currentUserIdFirestore = await this.getCurrentUserID();
    await this.getCurrentUserData();
    await this.getAllUserData();
    this.checkTypeOfDocId(this.currentUser.currentChannelId);
    this.updateUserData();
    // this.getInstanceData();
    this.getInstanceId();
    this.subscribeInstance(this.instanceId, this.instance);
  }

  getInstanceId() {
    this.route.params.subscribe((params) => {
      this.instanceId = params['id'];
    });
  }

  /**
   * Subscribes the current activated Route
   * @param instanceId The Id of the document
   * @param instance Ether 'channel' or 'conversation'
   */
  subscribeInstance(instanceId: string, instance: string) {
    if (instance === 'channel')
      this.firestore
        .collection('channels')
        .doc(instanceId)
        .valueChanges()
        .subscribe((channel: IChannel) => {
          this.currentInstance = new Channel(channel);
        });
    else {
      this.firestore
        .collection('conversations')
        .doc(instanceId)
        .valueChanges()
        .subscribe((conversation: IConversation) => {
          this.currentInstance = new Conversation(conversation);
        });
    }
  }

  /**
   * Checks if the currentChannelId is a Channel or a Conversation
   * @param id The id of the Document
   */
  checkTypeOfDocId(id: string) {
    this.firestore
      .collection('channels')
      .doc(`${id}`)
      .ref.get()
      .then((doc) => {
        if (doc) {
          this.instance = 'channel';
        } else {
          this.instance = 'conversation';
        }
      });
  }

  // getInstanceData() {
  //   if(this.instance == 'channel') {
  //     this.getChannelData();
  //   }
  //   else {
  //     this.getConversationData();
  //   }
  // }

  // getChannelData() {
  //   this.firestore
  //     .collection('channels')
  //     .doc(this.currentUser.currentChannelId)
  //     .valueChanges()
  //     .subscribe((doc: IChannel) => {
  //       this.currentInstance = new Channel(doc);
  //     });
  // }

  // getConversationData() {
  //   this.firestore
  //     .collection('conversations')
  //     .doc(this.currentUser.currentChannelId)
  //     .valueChanges()
  //     .subscribe((doc: IConversation) => {
  //       this.currentInstance = new Conversation(doc);
  //     });
  // }

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
      .doc(this.currentUserIdFirestore)
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
