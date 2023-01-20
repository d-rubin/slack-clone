import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-mainarea',
  templateUrl: './mainarea.component.html',
  styleUrls: ['./mainarea.component.scss']
})
export class MainareaComponent implements OnInit {

  constructor(
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.navigateToFirestoreDoc();
  }

  navigateToFirestoreDoc() {
    if(this.dataService.instance === 'channel') {
      this.router.navigateByUrl('channels/' + this.dataService.currentUser.currentChannelId)
    }
    else if (this.dataService.instance === 'conversation'){
      this.router.navigateByUrl('conversations/' + this.dataService.currentUser.currentChannelId);
    }
  }

}
