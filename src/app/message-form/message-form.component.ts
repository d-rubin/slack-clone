import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ChatMessage } from '../models/chatMessage.class';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion } from '@angular/fire/firestore';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
  providers: [DataService],
})
export class MessageFormComponent implements OnInit {
  message: string;

  constructor(private dataService: DataService, private afs: AngularFirestore) {
    this.ngOnInit();
  }

  async ngOnInit() {}

  async sendMessage() {
    let chatMessage = new ChatMessage(
      this.dataService.currentUser['currentUserId'],
      this.dataService.currentUser['name']
    );
    chatMessage.messageSender = this.message;

    let chatJSON = JSON.stringify(chatMessage);

    await this.sendMessageToFirestore(chatJSON);
    this.message = '';
  }

  async sendMessageToFirestore(message: any) {
    const messageRef = await this.afs.firestore
      .collection('channels')
      .doc(this.dataService.currentUser['currentChannelId'])
      .update({
        messages: arrayUnion(message),
      });
  }
}
