import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toast: HotToastService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {}
  get email() {
    // for error massage mat-error
    return this.loginForm.get('email');
  }

  get password() {
    // for error massage mat-error
    return this.loginForm.get('password');
  }

  submit() {
    if (!this.loginForm.valid) {
      // if not valid,
      return; // we will do nothing we will not go to proceed
    }

    const { email, password } = this.loginForm.value;
    this.authService
      .login(email, password)
      .pipe(
        this.toast.observe({
          success: 'Logged in successfully',
          loading: 'Logging in....',
          error: 'There was an error',
        })
      )
      .subscribe(() => {
        this.router.navigate(['mainarea/'+ this.dataService.currentUser.currentChannelId]);
      });
  }

  /*  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  } */

  guest() {
    console.warn('Sorry, at this point you habe to be logged in');
  }
}
