import { PushNotificationService } from './../../shared/services/push-notifications.service';
import { LoginInterface } from './login.interface';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../theme/validators';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  items: any;
  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  submitted: boolean = false;

  constructor(fb: FormBuilder,
              protected service: AuthService, 
              private pushNotificationService: PushNotificationService,
              private authService: AuthService) {

    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    });

    this.email = this.form.controls['email'];
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
      values.recordarSesion = true;
      this.service
        .login(values)
        .subscribe(
            (response: any) => { 
              console.log(response); 
              if (response.success) {
                this.pushNotificationService.addPushSubscriber(response.iduser, response.idrol);
              }
           });
    }
  }

}