import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-conversation-dialog',
  templateUrl: './conversation-dialog.component.html',
  styleUrls: ['./conversation-dialog.component.scss']
})
export class ConversationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConversationDialogComponent>) { }

  ngOnInit(): void {
  }

}
