import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): boolean {

    let isAuthorized: boolean;

    if(this.authService.loggedIn()) {
      //Módulos permitidos
      if (!this.authService.modulePermission(url)) {
        isAuthorized = false;
        console.log("sin permiso");
      } else {
        isAuthorized = true;
        console.log("con permiso");
      }
    } else {
      isAuthorized = false;
      console.log("sin autorización");
    }

    if(isAuthorized) {
      return true;
    } else {
      // Store the attempted URL for redirecting
      // this.authService.redirectUrl = url;

      // Navigate to the login page with extras
      this.router.navigate(['/pages/unauthorized']);
      return false;
    }

  }
}