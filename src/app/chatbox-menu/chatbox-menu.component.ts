import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatbox-menu',
  templateUrl: './chatbox-menu.component.html',
  styleUrls: ['./chatbox-menu.component.scss']
})
export class ChatboxMenuComponent implements OnInit {
  name: string = 'NAME';
  members: number = 15;

  constructor() { }

  ngOnInit(): void {
  }

}
