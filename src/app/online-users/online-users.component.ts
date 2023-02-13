import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { DataBase } from '../services/data.service';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.scss'],
})
export class OnlineUsersComponent implements OnInit {
  constructor(
    public firestore: AngularFirestore,
    public dataService: DataBase,
    private router: Router
  ) {}

  allUser = [];
  currentUserEmail: any;
  currentUserIdFirestore: any;
  auth = getAuth();
 

  async ngOnInit() {
 
  }


}
