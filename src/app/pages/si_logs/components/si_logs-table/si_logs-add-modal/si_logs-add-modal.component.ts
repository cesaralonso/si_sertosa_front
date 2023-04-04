import { AuthService } from './../../../../../shared/services/auth.service';
import { Si_logsService } from './../si_logs.service';
import { Si_logsInterface } from './../si_logs.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { Si_modulosService } from './../../../../si_modulos/components/si_modulos-table/si_modulos.service';
import { Si_modulosAddModalComponent } from './../../../../si_modulos/components/si_modulos-table/si_modulos-add-modal/si_modulos-add-modal.component';
import { Si_modulosInterface } from './../../../../si_modulos/components/si_modulos-table/si_modulos.interface';
import { Si_usersService } from './../../../../si_users/components/si_users-table/si_users.service';
import { Si_usersAddModalComponent } from './../../../../si_users/components/si_users-table/si_users-add-modal/si_users-add-modal.component';
import { Si_usersInterface } from './../../../../si_users/components/si_users-table/si_users.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./si_logs-add-modal.component.scss')],
  templateUrl: './si_logs-add-modal.component.html'
})
export class Si_logsAddModalComponent implements OnInit {
  _si_modulo: Si_modulosInterface[] = [];
  _si_user: Si_usersInterface[] = [];
  si_moduloRewriteable: boolean = false;
  si_userRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: Si_logsService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private si_modulosService: Si_modulosService,
    private si_usersService: Si_usersService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Si_logsAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Si_logsInterface
  ) {
    this.form = fb.group({
    'si_modulo_idsi_moduloAC' : ['', this.item.si_modulo_idsi_modulo ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'accionAC' : ['', this.item.accion ? Validators.compose([ Validators.required, Validators.maxLength(150)]) : null],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.si_moduloRewriteable = true;
        this.si_userRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/si_modulos') {
                        this.si_moduloRewriteable = userModules[element].writeable;
                    }
                    if (userModules[element].path === '/pages/si_users') {
                        this.si_userRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getSi_modulo();
      this.getSi_user();
      // Revisa si es agregar o editar
      if (this.item.idsi_log) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
      }
  }
  si_moduloAddModalShow() {
      const dialogRef = this.dialog.open(Si_modulosAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.si_moduloShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  si_moduloShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getSi_modulo(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
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
  getSi_modulo(idsi_modulo?: number) {
      this.si_modulosService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._si_modulo = data.result;
              if (idsi_modulo) {
                  this.form.patchValue({
                      si_modulo_idsi_moduloAC: idsi_modulo
                  });
              }
          });
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
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idsi_log) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  si_modulo_idsi_modulo: this.item.si_modulo_idsi_modulo || null,
                  accion: this.item.accion || null,
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
                  idsi_log: this.item.idsi_log,
                  si_modulo_idsi_modulo: this.item.si_modulo_idsi_modulo,
                  accion: this.item.accion,
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
