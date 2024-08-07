import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UtilityService } from '../services/utility.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      if (decodedToken && decodedToken.idRole === '1') {
        return true;
      } else if (decodedToken && decodedToken.idRole === '2') {
        this.router.navigate(['/home']);
        return false;
      }
    }
    alert('Please Create an account.');
    return false;
  }
}
