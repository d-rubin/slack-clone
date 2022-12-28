import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, DocumentReference, getDoc } from 'firebase/firestore';
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

  startConversation() {
    this.conversation.members.push(this.userEmail);
    this.firestore
    .collection<any>('users', ref => ref.where('name', '==', this.userName))
    .valueChanges()
    .subscribe(user => {
      this.conversation.members.push(user[0].email);
    });
    setTimeout(() => {
      this.firestore
      .collection('conversations')
      .add(this.conversation.toJSON())
      .then(() => {
        this.dialogRef.close();
      });
    }, 500);
  }
}
