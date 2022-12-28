import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { HotToastService } from '@ngneat/hot-toast';

export function passwordsMatchValidators(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password != confirmPassword) {
      return {
        passwordsDontMatch: true,
      };
    }
    return null;
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordsMatchValidators() }
  );

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {}

  get name() {
    // for error massage mat-error
    return this.signUpForm.get('name');
  }

  get email() {
    // for error massage mat-error
    return this.signUpForm.get('email');
  }

  get password() {
    // for error massage mat-error
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    // for error massage mat-error
    return this.signUpForm.get('confirmPassword');
  }

  submit() {
    if (!this.signUpForm.valid) return; // if not valid, // we will do nothing we will not go to proceed

    const { name, email, password } = this.signUpForm.value;
    this.authService
      .signUp(name, email, password)
      .pipe(
        this.toast.observe({
          success: 'Congrats! Your are signed up ',
          loading: 'Signing in.',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }

  guest() {
    this.router.navigate(['/mainarea']);
  }
}
