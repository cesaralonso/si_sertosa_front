import { PushNotificationService } from '../../shared/services/push-notifications.service';
import { LoginInterface } from './../login/login.interface';
import { AuthService } from '../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../theme/validators';
import { Router } from '@angular/router';

@Component({
  selector: 'login-employee',
  templateUrl: './login-employee.html',
  styleUrls: ['./login-employee.scss']
})
export class LoginEmployeeComponent implements OnInit {
  form: FormGroup;
  password: AbstractControl;
  submitted: boolean = false;

  constructor(fb: FormBuilder,
              protected service: AuthService, 
              private router: Router,
              private pushNotificationService: PushNotificationService,
              private authService: AuthService) {

    this.form = fb.group({
      'password': ['', Validators.compose([Validators.required])]
    });

    this.password = this.form.controls['password'];
    
    if (this.authService.loggedIn()) {
      this.authService.navigateToFirstModule();
    }
  }

  ngOnInit() {
  }

  onSubmit(values: LoginInterface): void {
    this.submitted = true;
    if (this.form.valid) {
      values.module = "employee";
      this.service
        .loginNip(values)
        .subscribe(
            (response: any) => { 
              if (response.success) {
                this.pushNotificationService.addPushSubscriber(response.iduser, response.idrol);
                  
              // envía a órdnees trabajando
              this.router.navigate(['pages/service_employees']);
              }
           });
    }
  }

}