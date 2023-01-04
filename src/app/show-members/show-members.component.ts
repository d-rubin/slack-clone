import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.class';

@Component({
  selector: 'app-show-members',
  templateUrl: './show-members.component.html',
  styleUrls: ['./show-members.component.scss']
})
export class ShowMembersComponent implements OnInit {
  members: User[] = [];

  constructor() { }

  ngOnInit(): void {
    
  }

}
