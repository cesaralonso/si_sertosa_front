import { AuthService } from './../../../../../shared/services/auth.service';
import { Si_user_rolsService } from './../si_user_rols.service';
import { Si_user_rolsInterface } from './../si_user_rols.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { Si_usersService } from './../../../../si_users/components/si_users-table/si_users.service';
import { Si_usersAddModalComponent } from './../../../../si_users/components/si_users-table/si_users-add-modal/si_users-add-modal.component';
import { Si_usersInterface } from './../../../../si_users/components/si_users-table/si_users.interface';
import { Si_rolsService } from './../../../../si_rols/components/si_rols-table/si_rols.service';
import { Si_rolsAddModalComponent } from './../../../../si_rols/components/si_rols-table/si_rols-add-modal/si_rols-add-modal.component';
import { Si_rolsInterface } from './../../../../si_rols/components/si_rols-table/si_rols.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./si_user_rols-add-modal.component.scss')],
  templateUrl: './si_user_rols-add-modal.component.html'
})
export class Si_user_rolsAddModalComponent implements OnInit {
  _si_user: Si_usersInterface[] = [];
  _si_rol: Si_rolsInterface[] = [];
  si_userRewriteable: boolean = false;
  si_rolRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: Si_user_rolsService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private si_usersService: Si_usersService,
    private si_rolsService: Si_rolsService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Si_user_rolsAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Si_user_rolsInterface
  ) {
    this.form = fb.group({
    'codigoAC' : ['', this.item.codigo ? Validators.compose([ Validators.required, Validators.maxLength(15)]) : null],
    'si_user_idsi_userAC' : ['', this.item.si_user_idsi_user ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'si_rol_idsi_rolAC' : ['', this.item.si_rol_idsi_rol ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.si_userRewriteable = true;
        this.si_rolRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/si_users') {
                        this.si_userRewriteable = userModules[element].writeable;
                    }
                    if (userModules[element].path === '/pages/si_rols') {
                        this.si_rolRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getSi_user();
      this.getSi_rol();
      // Revisa si es agregar o editar
      if (this.item.idsi_user_rol) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
      }
  }
  si_userAddModalShow() {
      const dialogRef = this.dialog.open(Si_usersAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.si_userShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  si_userShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getSi_user(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
  }
  si_rolAddModalShow() {
      const dialogRef = this.dialog.open(Si_rolsAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.si_rolShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  si_rolShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getSi_rol(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
  }
  getSi_user(idsi_user?: number) {
      this.si_usersService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._si_user = data.result;
              if (idsi_user) {
                  this.form.patchValue({
                      si_user_idsi_userAC: idsi_user
                  });
              }
          });
  }
  getSi_rol(idsi_rol?: number) {
      this.si_rolsService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._si_rol = data.result;
              if (idsi_rol) {
                  this.form.patchValue({
                      si_rol_idsi_rolAC: idsi_rol
                  });
              }
          });
  }
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idsi_user_rol) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  codigo: this.item.codigo || null,
                  si_user_idsi_user: this.item.si_user_idsi_user || null,
                  si_rol_idsi_rol: this.item.si_rol_idsi_rol || null,
          })
          .pipe(take(1))
          .subscribe(
              (data: any) => {
              this.data = data;
              this.confirm();
              });
      }
  }
  onUpdate(): void {
      if (this.form.valid) {
          this.service
              .update({
                  idsi_user_rol: this.item.idsi_user_rol,
                  codigo: this.item.codigo,
                  si_user_idsi_user: this.item.si_user_idsi_user,
                  si_rol_idsi_rol: this.item.si_rol_idsi_rol,
              })
              .pipe(take(1))
              .subscribe(
                  (data: any) => {
                      this.data = data;
                      this.confirm();
              });
      }
  }
}
