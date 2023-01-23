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

    let requestData = await this.getCurrentChannelMessages();
    setTimeout(() => {
      let observeCurrentChannelId = this.observeCurrenChannelId();
    }, 3000);
  }

  updateCurrentChannelData(data: any) {
    this.updateCurrentChannelMessages.next(data);
  }

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
    if (docRef !== undefined) {
      docRef.valueChanges().subscribe((doc: string) => {
        this.updateCurrentChannelData(doc);
        counter = 3;
      });
    } else {
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

  async observeCurrenChannelId() {
    let currentChannelId;
    let refCol = this.afs.collection('users');
    let docRef = refCol.doc(`${this.dataService.currentUserId}`);
    docRef.valueChanges().subscribe(async (doc: string) => {
      currentChannelId = await doc['currentChannelId'];
      this.getCurrentChannelMessages();
    });
  }
}
