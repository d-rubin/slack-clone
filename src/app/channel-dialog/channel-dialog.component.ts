import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-channel-dialog',
  templateUrl: './channel-dialog.component.html',
  styleUrls: ['./channel-dialog.component.scss']
})
export class ChannelDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ChannelDialogComponent>) { }

  ngOnInit(): void {
  }

}
