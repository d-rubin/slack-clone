import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBase } from '../services/data.service';

@Component({
  selector: 'app-mainarea',
  templateUrl: './mainarea.component.html',
  styleUrls: ['./mainarea.component.scss']
})
export class MainareaComponent implements OnInit {

  constructor(
    private router: Router,
    private dataService: DataBase,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getInstanceId();
    this.dataService.subscribeInstance(this.dataService.instanceId);
  }

  getInstanceId() {
    this.route.params.subscribe(params => {
      if (params.hasOwnProperty('id')) {
        this.dataService.instanceId = params['id'];
      } else {
        console.error("ID not found in URL params");
      }
    });
  }
}
