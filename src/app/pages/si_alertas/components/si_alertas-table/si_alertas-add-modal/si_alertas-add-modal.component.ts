import { AuthService } from './../../../../../shared/services/auth.service';
import { Si_alertasService } from './../si_alertas.service';
import { Si_alertasInterface } from './../si_alertas.interface';
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
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./si_alertas-add-modal.component.scss')],
  templateUrl: './si_alertas-add-modal.component.html'
})
export class Si_alertasAddModalComponent implements OnInit {
  _si_user: Si_usersInterface[] = [];
  si_userRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: Si_alertasService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private si_usersService: Si_usersService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Si_alertasAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Si_alertasInterface
  ) {
    this.form = fb.group({
    'si_user_idsi_userAC' : ['', this.item.si_user_idsi_user ? Validators.compose([ Validators.required, Validators.maxLength(4)]) : null],
    'tipoAlertaAC' : [''],
    'emailRemitenteAC' : ['', this.item.emailRemitente ? Validators.compose([ Validators.maxLength(150)]) : null],
    'emailDestinatarioAC' : ['', this.item.emailDestinatario ? Validators.compose([ Validators.maxLength(150)]) : null],
    'mensajeAC' : ['', this.item.mensaje ? Validators.compose([ Validators.required, Validators.maxLength(345)]) : null],
    'vistaAC' : [''],
    'leidaAC' : [''],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.si_userRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/si_users') {
                        this.si_userRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getSi_user();
      // Revisa si es agregar o editar
      if (this.item.idsi_alerta) {
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
      if (this.item.idsi_alerta) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  si_user_idsi_user: this.item.si_user_idsi_user || null,
                  tipoAlerta: this.item.tipoAlerta || null,
                  emailRemitente: this.item.emailRemitente || null,
                  emailDestinatario: this.item.emailDestinatario || null,
                  mensaje: this.item.mensaje || null,
                  vista: this.item.vista || null,
                  leida: this.item.leida || null,
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
                  idsi_alerta: this.item.idsi_alerta,
                  si_user_idsi_user: this.item.si_user_idsi_user,
                  tipoAlerta: this.item.tipoAlerta,
                  emailRemitente: this.item.emailRemitente,
                  emailDestinatario: this.item.emailDestinatario,
                  mensaje: this.item.mensaje,
                  vista: this.item.vista,
                  leida: this.item.leida,
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
