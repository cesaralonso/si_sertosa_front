import { AuthService } from './../../../../../shared/services/auth.service';
import { Si_rol_permisosService } from './../si_rol_permisos.service';
import { Si_rol_permisosInterface } from './../si_rol_permisos.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { Si_rolsService } from './../../../../si_rols/components/si_rols-table/si_rols.service';
import { Si_rolsAddModalComponent } from './../../../../si_rols/components/si_rols-table/si_rols-add-modal/si_rols-add-modal.component';
import { Si_rolsInterface } from './../../../../si_rols/components/si_rols-table/si_rols.interface';
import { Si_permisosService } from './../../../../si_permisos/components/si_permisos-table/si_permisos.service';
import { Si_permisosAddModalComponent } from './../../../../si_permisos/components/si_permisos-table/si_permisos-add-modal/si_permisos-add-modal.component';
import { Si_permisosInterface } from './../../../../si_permisos/components/si_permisos-table/si_permisos.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./si_rol_permisos-add-modal.component.scss')],
  templateUrl: './si_rol_permisos-add-modal.component.html'
})
export class Si_rol_permisosAddModalComponent implements OnInit {
  _si_rol: Si_rolsInterface[] = [];
  _si_permiso: Si_permisosInterface[] = [];
  si_rolRewriteable: boolean = false;
  si_permisoRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: Si_rol_permisosService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private si_rolsService: Si_rolsService,
    private si_permisosService: Si_permisosService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Si_rol_permisosAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Si_rol_permisosInterface
  ) {
    this.form = fb.group({
    'codigoAC' : ['', this.item.codigo ? Validators.compose([ Validators.required, Validators.maxLength(15)]) : null],
    'si_rol_idsi_rolAC' : ['', this.item.si_rol_idsi_rol ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'si_permiso_idsi_permisoAC' : ['', this.item.si_permiso_idsi_permiso ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.si_rolRewriteable = true;
        this.si_permisoRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/si_rols') {
                        this.si_rolRewriteable = userModules[element].writeable;
                    }
                    if (userModules[element].path === '/pages/si_permisos') {
                        this.si_permisoRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getSi_rol();
      this.getSi_permiso();
      // Revisa si es agregar o editar
      if (this.item.idsi_rol_permiso) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
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
  si_permisoAddModalShow() {
      const dialogRef = this.dialog.open(Si_permisosAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.si_permisoShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  si_permisoShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getSi_permiso(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
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
  getSi_permiso(idsi_permiso?: number) {
      this.si_permisosService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._si_permiso = data.result;
              if (idsi_permiso) {
                  this.form.patchValue({
                      si_permiso_idsi_permisoAC: idsi_permiso
                  });
              }
          });
  }
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idsi_rol_permiso) {
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
                  si_rol_idsi_rol: this.item.si_rol_idsi_rol || null,
                  si_permiso_idsi_permiso: this.item.si_permiso_idsi_permiso || null,
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
                  idsi_rol_permiso: this.item.idsi_rol_permiso,
                  codigo: this.item.codigo,
                  si_rol_idsi_rol: this.item.si_rol_idsi_rol,
                  si_permiso_idsi_permiso: this.item.si_permiso_idsi_permiso,
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
