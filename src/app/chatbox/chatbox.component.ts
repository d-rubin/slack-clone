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
    this.currentChannelMessages$.subscribe(async (data) => {
      this.currentChannelMessages$ = data;
      if (data !== null) {
        let cachArray = data['messages'];
        this.messageArray = cachArray.map((jsonString) =>
          JSON.parse(jsonString)
        );
        this.messageArray.reverse();

        console.log(this.messageArray);
      }
    });

    let requestData = await this.getCurrentChannelMessages();
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
        counter = 10;
      });
    } else {
      let intervalId = setInterval(() => {
        counter++;
        if (counter === 10) {
          clearInterval(intervalId);
          console.log(
            'getCurrentChannelMessages: Maximum retries reached, stopped retrying'
          );
        } else {
          this.getCurrentChannelMessages();
        }
      }, 1000);
    }
  }

  // async startAutoUpdateCurrentChannelMessages() {
  //   return new Promise(async (resolve: Function, reject: Function) => {
  //     try {
  //       this.afs
  //         .collection('channels')
  //         .doc(this.dataService.currentUser['currentChannelId'])
  //         .valueChanges()
  //         .subscribe(async (data: string) => {
  //           this.updateCurrentChannelData(data);
  //           console.log('UPDATET', this.currentChannelMessages$);
  //         });
  //       resolve();
  //     } catch (error) {
  //       reject('getCurrentChannelMessages() WAS FAIL!');
  //     }
  //   });
  // }
}
