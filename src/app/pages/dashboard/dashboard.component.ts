import { AuthService } from './../../shared/services/auth.service';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';


@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard implements AfterViewInit, OnInit {

  // Permisos en vista
  updateable: boolean = false;
  deleteable: boolean = false;
  writeable: boolean = false;
  user: any;

  constructor(
    private authService: AuthService) {
      
      // Buscar permisos del usuario en el módulo
      this.user = this.authService.useJwtHelper();
      
      if (this.user.super) {
        this.updateable = true;
        this.deleteable = true;
        this.writeable = true;
      } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
          for (const element in userModules) {
            if (userModules[element].path === '/pages/dashboard') {
              this.updateable = userModules[element].updateable;
              this.deleteable = userModules[element].deleteable;
              this.writeable = userModules[element].writeable;
            }
          }
        }
      }

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

}
