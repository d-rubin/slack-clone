import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

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
    private toast: HotToastService
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
        this.router.navigate(['/mainarea']);
      });
  }

  /*  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  } */

  guest() {
    this.router.navigate(['/mainarea']);
  }
}
