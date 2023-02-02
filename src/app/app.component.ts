import { Component } from '@angular/core';
import { DataBase } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DataBase],
})
export class AppComponent {
  title = 'slack-clone';

  constructor() {}



}
