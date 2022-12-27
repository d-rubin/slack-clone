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
  secondMember: any;
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
    this.getEmailWithUserName(this.userName);
    this.conversation.members.push(this.userEmail);
    this.conversation.members.push(this.secondMember);
    
    this.firestore
    .collection('conversations')
    .add(this.conversation.toJSON())
    .then(() => {
      this.dialogRef.close();
    });
    console.log(this.secondMember);
  }

  getEmailWithUserName(userName: string) {
    this.firestore.collection<any>('users', ref => ref.where('name', '==', userName)).valueChanges().subscribe(user => {
      this.secondMember = user[0].email;
    });
  }
}
