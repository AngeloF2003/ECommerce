import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message = '';
  isLoggedIn = false;

  constructor(
    private fb: FormBuilder,
    private navigationService: NavigationService,
    private utilityService: UtilityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ],
      ],
    });
  }

  // login() {
  //   this.navigationService
  //     .loginUser(this.Email.value, this.PWD.value)
  //     .subscribe((res: any) => {
  //       if (res.toString() !== 'invalid') {
  //         this.message = 'Logged In Successfully.';
  //         this.utilityService.setUser(res.toString());
  //         console.log(this.utilityService.getUser());
  //         this.isLoggedIn = true;
  //       } else {
  //         this.message = 'Invalid Credentials!';
  //       }
  //     });
  // }
  // login() {
  //   this.navigationService
  //     .loginUser(this.Email.value, this.PWD.value)
  //     .subscribe((res: any) => {
  //       if (res && res.id && res.idRole) {
  //         this.message = 'Logged In Successfully.';
  //         this.utilityService.setUser(res);
  //         console.log(this.utilityService.getUser());
  //         this.isLoggedIn = true;

  //         if (res.idRole === 1) {
  //           // User is an admin
  //           this.router.navigate(['/admin']);
  //         } else {
  //           // User is not an admin
  //           this.router.navigate(['/home']);
  //         }
  //       } else {
  //         this.message = 'Invalid Credentials!';
  //       }
  //       console.log(localStorage.getItem('user'));
  //     });
  // }
  login() {
    this.navigationService.loginUser(this.Email.value, this.PWD.value).subscribe(
      () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (user.idRole === '2') {
          this.message = 'Logged In Successfully.';
          this.router.navigate(['/home']);
        } else if (user.idRole === '1') {
          this.message = 'Logged In Successfully.';
          this.router.navigate(['/admin']);
        }

      },
      (error) => {
        console.error('Login error', error);
        alert('Login failed. Invalid email or password.');
      }
    );
  }


  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get PWD(): FormControl {
    return this.loginForm.get('pwd') as FormControl;
  }
}
