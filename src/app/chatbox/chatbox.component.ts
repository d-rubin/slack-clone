import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
  providers: [DataService],
})
export class ChatboxComponent implements OnInit {
  private updateCurrentChannelMessages = new BehaviorSubject(null);
  currentChannelMessages$: Observable<any> =
    this.updateCurrentChannelMessages.asObservable();

  messageArray = [];

  constructor(
    private afs: AngularFirestore,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    await this.dataService.getDataInterval();

    this.currentChannelMessages$.subscribe(async (data) => {
      this.currentChannelMessages$ = data;
      if (data !== null) {
        let cachArray = data['messages'];
        this.messageArray = cachArray.map((jsonString) =>
          JSON.parse(jsonString)
        );
        this.messageArray.reverse();
      }
    });

/* Waiting for the data to be fetched from the database. */
    let requestData = await this.getCurrentChannelMessages();
    setTimeout(() => {
      let observeCurrentChannelId = this.observeCurrenChannelId();
    }, 3000);
  }

/**
 * It takes in a data object, and then it updates the current channel messages with the data object.
 * @param {any} data - any - this is the data that is being passed to the updateCurrentChannelMessages
 * subject.
 */
  updateCurrentChannelData(data: any) {
    this.updateCurrentChannelMessages.next(data);
  }

/**
 * Subscribing to the valueChanges() method of the docRef, and if the docRef is undefined, then it is
 * waiting for the data to be fetched from the database.
 * </code>
 */
  async getCurrentChannelMessages() {
    let counter = 0;
    let docCol = this.afs.collection('channels');
    let docRef: AngularFirestoreDocument<unknown>;
    if (
      this.dataService.currentUser &&
      this.dataService.currentUser['currentChannelId']
    ) {
      docRef = docCol.doc(this.dataService.currentUser['currentChannelId']);
    }
/* Checking if the docRef is not undefined, and if it is not undefined, then it is subscribing to the
valueChanges() method of the docRef. */
    if (docRef !== undefined) {
      docRef.valueChanges().subscribe((doc: string) => {
        this.updateCurrentChannelData(doc);
        counter = 3;
      });
    } else {
/* Waiting for the data to be fetched from the database. */
      let intervalId = setInterval(() => {
        counter++;
        if (counter === 3) {
          clearInterval(intervalId);
        } else {
          this.getCurrentChannelMessages();
        }
      }, 1000);
    }
  }

/**
 * The function is subscribing to the valueChanges() method of the docRef, and if the docRef is
 * undefined, then it is waiting for the data to be fetched from the database.
 */
  async observeCurrenChannelId() {
    let currentChannelId;
    let refCol = this.afs.collection('users');
/* Subscribing to the valueChanges() method of the docRef, and if the docRef is undefined, then it is
 * waiting for the data to be fetched from the database.
 * </code> */
    let docRef = refCol.doc(`${this.dataService.currentUserId}`);
    docRef.valueChanges().subscribe(async (doc: string) => {
      currentChannelId = await doc['currentChannelId'];
      this.getCurrentChannelMessages();
    });
  }
}
