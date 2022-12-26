import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from "@angular/material/dialog";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Conversation } from '../models/Conversation.class';

@Component({
  selector: 'app-conversation-dialog',
  templateUrl: './conversation-dialog.component.html',
  styleUrls: ['./conversation-dialog.component.scss']
})
export class ConversationDialogComponent implements OnInit {

  userId: string;
  conversation: Conversation = new Conversation();
  userName:string;
  allUsers;


  constructor(
    public dialogRef: MatDialogRef<ConversationDialogComponent>,
    public firestore: AngularFirestore,
    private auth: Auth
    ) { }

  ngOnInit(): void {
    onAuthStateChanged(getAuth(), (user) => {
      this.userId = user.uid;
    });
  }

  startConversation() {
    
    this.firestore
    .collection('Conversations')
    .add(this.conversation.toJSON())
    .then(() => {
      this.dialogRef.close();
    })
  }
}
