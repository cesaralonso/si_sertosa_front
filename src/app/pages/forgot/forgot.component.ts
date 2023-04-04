import { AuthService } from './../../shared/services/auth.service';
import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'forgot',
  templateUrl: './forgot.html',
  styleUrls: ['./forgot.scss']
})
export class Forgot {
  public form:FormGroup;
  public email:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;

  constructor(fb:FormBuilder,
    private authService: AuthService) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
  }

  public onSubmit(values:Object):void {
    this.submitted = true;
    if (this.form.valid) {
      this.authService.forgotPassword(this.form.controls['email'].value)
        .subscribe(response => {

          console.log('onSubmit Forgot response', response);
        });
    }
  }
}
