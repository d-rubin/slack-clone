import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, DocumentReference, getDoc } from 'firebase/firestore';
import { first } from 'rxjs';
import { Conversation } from '../models/Conversation.class';
import { User } from '../models/user.class';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-conversation-dialog',
  templateUrl: './conversation-dialog.component.html',
  styleUrls: ['./conversation-dialog.component.scss'],
  providers: [DataService],
})
export class ConversationDialogComponent implements OnInit {
  currentUser = new User();
  userEmail: string;
  secondMember: string;
  conversation: Conversation = new Conversation();
  userName: string;
  newConversationlID: string;

  constructor(
    public dialogRef: MatDialogRef<ConversationDialogComponent>,
    public firestore: AngularFirestore,
    public dataService: DataService
  ) {}

  ngOnInit(): void {}

  async startConversation() {
    this.currentUser = await this.dataService.currentUser;
    this.conversation.members.push(this.dataService.currentUserIdFirestore);

    await this.addSecondMemberToConversation();

    await this.saveConversation();
    this.conversation.conversationID = this.newConversationlID;
    await this.addIdNewConversationID(this.conversation.conversationID);
    this.dialogRef.close();
  }

  async addIdNewConversationID(newConversationID) {
    const updId = this.firestore.doc(`conversations/${newConversationID}`);
    updId.update({ conversationID: newConversationID });
    console.log(newConversationID);
  }

  async saveConversation() {
    await this.firestore
      .collection('conversations')
      .add(this.conversation.toJSON())
      .then((doc) => {
        this.newConversationlID = doc.id;
      });
  }

  addSecondMemberToConversation() {
    return new Promise((resolve: Function, reject: Function) => {
      this.firestore
        .collection<any>('users', (ref) =>
          ref.where('name', '==', this.userName)
        )
        .valueChanges()
        .pipe(first())
        .subscribe(
          (user) => {
            this.conversation.name = this.userName;
            this.conversation.members.push(user[0].currentUserId);

            resolve();
          },
          (error: any) => {
            reject('Failed to connect to the database.');
          }
        );
    });
  }
}
