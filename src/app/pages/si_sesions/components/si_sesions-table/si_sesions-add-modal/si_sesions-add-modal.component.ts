import { AuthService } from './../../../../../shared/services/auth.service';
import { Si_sesionsService } from './../si_sesions.service';
import { Si_sesionsInterface } from './../si_sesions.interface';
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
  styleUrls: [('./si_sesions-add-modal.component.scss')],
  templateUrl: './si_sesions-add-modal.component.html'
})
export class Si_sesionsAddModalComponent implements OnInit {
  _si_user: Si_usersInterface[] = [];
  si_userRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: Si_sesionsService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private si_usersService: Si_usersService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Si_sesionsAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Si_sesionsInterface
  ) {
    this.form = fb.group({
    'codigoAC' : ['', this.item.codigo ? Validators.compose([ Validators.required, Validators.maxLength(15)]) : null],
    'tipoAC' : [''],
    'si_user_idsi_userAC' : ['', this.item.si_user_idsi_user ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'estadoAC' : [''],
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
      if (this.item.idsi_sesion) {
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
      if (this.item.idsi_sesion) {
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
                  tipo: this.item.tipo || null,
                  si_user_idsi_user: this.item.si_user_idsi_user || null,
                  estado: this.item.estado || null,
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
                  idsi_sesion: this.item.idsi_sesion,
                  codigo: this.item.codigo,
                  tipo: this.item.tipo,
                  si_user_idsi_user: this.item.si_user_idsi_user,
                  estado: this.item.estado,
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
