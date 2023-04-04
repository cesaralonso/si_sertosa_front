import { AuthService } from './../../../../../shared/services/auth.service';
import { Si_permisosService } from './../si_permisos.service';
import { Si_permisosInterface } from './../si_permisos.interface';
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
import { Si_modulosService } from './../../../../si_modulos/components/si_modulos-table/si_modulos.service';
import { Si_modulosAddModalComponent } from './../../../../si_modulos/components/si_modulos-table/si_modulos-add-modal/si_modulos-add-modal.component';
import { Si_modulosInterface } from './../../../../si_modulos/components/si_modulos-table/si_modulos.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./si_permisos-add-modal.component.scss')],
  templateUrl: './si_permisos-add-modal.component.html'
})
export class Si_permisosAddModalComponent implements OnInit {
  _si_rol: Si_rolsInterface[] = [];
  _si_modulo: Si_modulosInterface[] = [];
  si_rolRewriteable: boolean = false;
  si_moduloRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: Si_permisosService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private si_rolsService: Si_rolsService,
    private si_modulosService: Si_modulosService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Si_permisosAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Si_permisosInterface
  ) {
    this.form = fb.group({
    /* 'codigoAC' : ['', this.item.codigo ? Validators.compose([ Validators.maxLength(15)]) : null], */
    'nombreAC' : ['', this.item.nombre ? Validators.compose([ Validators.required, Validators.maxLength(45)]) : null],
    'si_rol_idsi_rolAC' : ['', this.item.si_rol_idsi_rol ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'si_modulo_idsi_moduloAC' : ['', this.item.si_modulo_idsi_modulo ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'accesoAC' : [''],
    'readableAC' : [''],
    'writeableAC' : [''],
    'updateableAC' : [''],
    'deleteableAC' : [''],
    'read_ownAC' : [''],
    'write_ownAC' : [''],
    'update_ownAC' : [''],
    'delete_ownAC' : [''],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.si_rolRewriteable = true;
        this.si_moduloRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/si_rols') {
                        this.si_rolRewriteable = userModules[element].writeable;
                    }
                    if (userModules[element].path === '/pages/si_modulos') {
                        this.si_moduloRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getSi_rol();
      this.getSi_modulo();
      // Revisa si es agregar o editar
      if (this.item.idsi_permiso) {
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
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idsi_permiso) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  /* codigo: this.item.codigo || null, */
                  nombre: this.item.nombre || null,
                  si_rol_idsi_rol: this.item.si_rol_idsi_rol || null,
                  si_modulo_idsi_modulo: this.item.si_modulo_idsi_modulo || null,
                  acceso: this.item.acceso || null,
                  readable: this.item.readable || null,
                  writeable: this.item.writeable || null,
                  updateable: this.item.updateable || null,
                  deleteable: this.item.deleteable || null,
                  read_own: this.item.read_own || null,
                  write_own: this.item.write_own || null,
                  update_own: this.item.update_own || null,
                  delete_own: this.item.delete_own || null,
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
                  idsi_permiso: this.item.idsi_permiso,
                  /* codigo: this.item.codigo, */
                  nombre: this.item.nombre,
                  si_rol_idsi_rol: this.item.si_rol_idsi_rol,
                  si_modulo_idsi_modulo: this.item.si_modulo_idsi_modulo,
                  acceso: this.item.acceso,
                  readable: this.item.readable,
                  writeable: this.item.writeable,
                  updateable: this.item.updateable,
                  deleteable: this.item.deleteable,
                  read_own: this.item.read_own,
                  write_own: this.item.write_own,
                  update_own: this.item.update_own,
                  delete_own: this.item.delete_own,
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
