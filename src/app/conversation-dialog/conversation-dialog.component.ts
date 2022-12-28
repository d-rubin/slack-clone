import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, DocumentReference, getDoc } from 'firebase/firestore';
import { first } from 'rxjs';
import { Conversation } from '../models/Conversation.class';
import { User } from '../models/user.class';


@Component({
  selector: 'app-conversation-dialog',
  templateUrl: './conversation-dialog.component.html',
  styleUrls: ['./conversation-dialog.component.scss']
})
export class ConversationDialogComponent implements OnInit {

  userEmail: string;
  secondMember: string;
  conversation: Conversation = new Conversation();
  userName:string;

  constructor(
    public dialogRef: MatDialogRef<ConversationDialogComponent>,
    public firestore: AngularFirestore,
    ) { }

  ngOnInit(): void {
    onAuthStateChanged(getAuth(), (user) => {
      this.userEmail = user.email;
    });
  }

  async startConversation() {
    this.conversation.members.push(this.userEmail);
    await this.addSecondMemberToConversation();
    await this.saveConversation();
    this.dialogRef.close();
  }

  saveConversation() {
    return this.firestore
      .collection('conversations')
      .add(this.conversation.toJSON());
  }

  addSecondMemberToConversation() {
    return new Promise((resolve: Function, reject: Function) => {
      this.firestore
      .collection<any>('users', ref => 
        ref.where('name', '==', this.userName))
      .valueChanges()
      .pipe(first())
      .subscribe(
        (user) => {
          this.conversation.members.push(user[0].email);
          resolve();
        },
        (error: any) => {
          reject('Failed to connect to the database.');
        }
      );
    })
  }
}
