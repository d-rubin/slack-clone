import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-conversation-dialog',
  templateUrl: './conversation-dialog.component.html',
  styleUrls: ['./conversation-dialog.component.scss']
})
export class ConversationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConversationDialogComponent>,
    // public firestore: AngularFirestore
    ) { }

  ngOnInit(): void {
  }

  startConversation() {

  }
}
