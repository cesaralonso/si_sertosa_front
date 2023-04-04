import { LoginResponseInterface } from './../login/login-response.interface';
import { LoginInterface } from './../login/login.interface';
import { AuthService } from './../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ToasterService } from './../../shared/services/toaster.service';
import { ChangePasswordService } from './change-password.service';
import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EqualPasswordsValidator } from '../../theme/validators';


@Component({
  selector: 'change-password',
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.scss']
})
export class ChangePasswordComponent {

  form: FormGroup;
  idusuario: AbstractControl;
  nuevopassword: AbstractControl;
  anteriorpassword: AbstractControl;
  password: AbstractControl;
  repetirpassword: AbstractControl;
  submitted: boolean = false;
  passwords: FormGroup;

  private iduser: string;
  private email: string;
  
  constructor(fb: FormBuilder,
    private authService: AuthService,
    private service: ChangePasswordService,
    private toastrService: ToasterService,
    private router: Router,
    ) {

    this.iduser = localStorage.getItem('iduser');
    this.email = localStorage.getItem('email');

    this.form = fb.group({
      'idusuario': this.iduser,
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'passwords': fb.group({
        'nuevopassword': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        'repetirpassword': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      }, { validator: EqualPasswordsValidator.validate('nuevopassword', 'repetirpassword') })
    });

    this.password = this.form.controls['password'];
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.nuevopassword = this.passwords.controls['nuevopassword'];
    this.repetirpassword = this.passwords.controls['repetirpassword'];
  }

  onSubmit(values: LoginInterface): void {
    this.submitted = true;
    if (this.form.valid) {

      // Valida usuario contra contraseña anterior del usuario
      const credentials: LoginInterface = {
        'email': this.email,
        'password': values.password,
        'recordarSesion': false,
      };

      this.authService
        .login(credentials)
        .subscribe(
            (response: LoginResponseInterface) => this.changePassword(response, values));
    }
  }

  private changePassword(response: LoginResponseInterface, valuesChangePasswordForm: any) {
    if (response.success) {
      // Si fue validado el usuario con la contraseña anterior procede con el cambio de password
      const newPassword: LoginInterface = {
        'idsi_user': +this.iduser,
        'email': valuesChangePasswordForm.email,
        'password': valuesChangePasswordForm.passwords.nuevopassword,
      };

      this.service
        .changePassword(newPassword)
        .subscribe(
            (data: LoginResponseInterface) => this.showToast(data));

    } else {
      this.toastrService.error(response.message);
    }
  }

  private showToast(data: LoginResponseInterface) {
    if (data.success) {
      this.toastrService.success(data.message);
      this.router.navigate(['login']);
    } else {
      this.toastrService.error(data.message);
    }
  }

}
