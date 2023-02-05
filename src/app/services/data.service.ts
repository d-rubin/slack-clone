import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { User, IUser } from '../models/user.class';
import { Observable, of } from 'rxjs';
import { Channel, IChannel } from '../models/channel.class';
import { Conversation, IConversation } from '../models/Conversation.class';
import { ActivatedRoute, Route } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataBase {
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
  menu: boolean;
  icon: string;
  windowWidth: number;

  // declare an observable that will be used to subscribe to the currentUser$ observable
  currentUser: User;
  currentUser$: Observable<typeof this.currentUser>;

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {
    this.init();
  }


  async init() {
    this.getInstanceId();
    this.currentUserEmail = await this.onAuthStateChanged();
    this.currentUserId = await this.getCurrentUserID();
    this.getCurrentUserData();
    await this.getAllUserData();
    this.subscribeInstance(this.instanceId);
    this.controlWindowWidth();
  }

  controlWindowWidth() {
    this.windowWidth = window.innerWidth;
    if(this.windowWidth < 700) {
      this.menu = false;
      this.icon = 'menu';
    }
    else {
      this.menu = true;
      this.icon = 'close';
    }
  }

  showMenu() {
    if(this.menu) {
      this.icon = 'menu';
      this.menu = false;
    }
    else {
      this.icon = 'close';
      this.menu = true;
    }
  }

 /**
 * When the route changes, subscribe to the route parameters and set the instanceId to the id
 * parameter.
 */
 getInstanceId() {
  this.route.params.subscribe(params => {
    if (params.hasOwnProperty('id')) {
      this.instanceId = params['id'];
      console.log(this.instanceId);
    } else {
      console.error("ID not found in URL params");
    }
  });
}




  /**
   * Subscribes the current activated Route
   * @param instanceId The Id of the document
   */
  subscribeInstance(instanceId: string) {
    this.firestore
    .collection('channels')
    .doc(instanceId)
    .valueChanges()
    .subscribe(instance => {
      this.currentInstance = new Channel(instance as IChannel);
      console.log('Instance is: ',this.currentInstance,'instanceId is: ', instanceId);
    });
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

/**
 * This function creates a new observable from the current user, and subscribes to it.
 */
  updateCurrentUserObservable() {
    this.currentUser$ = of(this.currentUser);
    this.currentUser$.subscribe();
  }

/**
 * This function creates a new instance of the User class, and then calls the updateUser() function.
 */
  updateUserData() {
    this.uploadableUser = new User(this.currentUser);
    this.uploadableUser.currentUserId = this.currentUserId;
    this.updateUser();
  }

/**
 * It updates the user's document in the users collection with the data from the uploadableUser object.
 */
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
  getCurrentUserData() {
    this.firestore
      .collection('users')
      .doc(this.currentUserId)
      .valueChanges()
      .subscribe(async (doc) => {
        if (doc) {
          this.updateCurrentUserObservable();
          this.currentUser = new User(doc as IUser);
          this.instance = await this.checkTypeOfDocId(this.currentUser.currentChannelId);
        }
      });
  }

/**
 * It returns a promise that resolves when the firestore collection is retrieved.
 * @returns An array of User objects.
 */
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

/**
 * If the response status is 200, clear the interval and return true.
 * @returns The return value is a Promise that resolves to true.
 */
  async getDataInterval() {
    let getDataIntervalStop = setInterval(() => {
      if (this.reaponseUserIdStatus200) {
        clearInterval(getDataIntervalStop);
      }
    }, 100);
    return true;
  }
}
