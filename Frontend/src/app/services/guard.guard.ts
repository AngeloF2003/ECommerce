import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UtilityService } from '../services/utility.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor( private router: Router,
           private ut: UtilityService) {}

  canActivate(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.idRole === '1') {
      return true;
    } else {
      if (user && user.idRole === '2') {
        this.router.navigate(['/home']);
      } else {
        alert('Please Create an account.');
      }
      return false;
    }
  }
}
