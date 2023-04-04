import { AuthService } from './../../../../../shared/services/auth.service';
import { Si_usersService } from './../si_users.service';
import { Si_usersInterface } from './../si_users.interface';
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
import { CompanyunitssService } from './../../../../companyunitss/components/companyunitss-table/companyunitss.service';
import { CompanyunitssAddModalComponent } from './../../../../companyunitss/components/companyunitss-table/companyunitss-add-modal/companyunitss-add-modal.component';
import { CompanyunitssInterface } from './../../../../companyunitss/components/companyunitss-table/companyunitss.interface';
import { Si_user_rolsService } from './../../../../si_user_rols/components/si_user_rols-table/si_user_rols.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./si_users-add-modal.component.scss')],
  templateUrl: './si_users-add-modal.component.html'
})
export class Si_usersAddModalComponent implements OnInit {
  _si_rol: Si_rolsInterface[] = [];
  _companyunits: CompanyunitssInterface[] = [];
  si_rolRewriteable: boolean = false;
  companyunitsRewriteable: boolean = false;
  si_user_rol: any[];

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';
  password = "";

  constructor(
    private service: Si_usersService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private si_rolsService: Si_rolsService,
    private companyunitssService: CompanyunitssService,
    private si_user_rolsService: Si_user_rolsService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Si_usersAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Si_usersInterface
  ) {
    this.form = fb.group({
    'nombreAC' : ['', this.item.nombre ? Validators.compose([ Validators.required, Validators.maxLength(95)]) : null],
    'apmatAC' : ['', this.item.apmat ? Validators.compose([ Validators.required, Validators.maxLength(45)]) : null],
    'appatAC' : ['', this.item.appat ? Validators.compose([ Validators.required, Validators.maxLength(45)]) : null],
    'emailAC' : ['', this.item.email ? Validators.compose([ Validators.required, Validators.maxLength(45)]) : null],
    'passwordAC' : ['', this.item.password ? Validators.compose([ Validators.required, Validators.maxLength(60)]) : null],
    'si_rol_idsi_rolAC' : ['', this.item.si_rol_idsi_rol ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'companyunits_idcompanyunitsAC' : ['', this.item.companyunits_idcompanyunits ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'statusAC' : [''],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.si_rolRewriteable = true;
        this.companyunitsRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/si_rols') {
                        this.si_rolRewriteable = userModules[element].writeable;
                    }
                    if (userModules[element].path === '/pages/companyunitss') {
                        this.companyunitsRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getSi_rol();
      this.getCompanyunits();
      this.getSi_rol();
      // Revisa si es agregar o editar
      if (this.item.idsi_user) {
          this.accion = "Editar";
          // Password acondicionamiento
          this.password = this.item.password;
          this.item.password = "";
      } else {
          this.accion = "Agregar";
      }
      this.item.password = '';
  }
  companyunitsAddModalShow() {
      const dialogRef = this.dialog.open(CompanyunitssAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.companyunitsShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  companyunitsShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getCompanyunits(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
  }
  getCompanyunits(idcompanyunits?: number) {
      this.companyunitssService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._companyunits = data.result;
              if (idcompanyunits) {
                  this.form.patchValue({
                      companyunits_idcompanyunitsAC: idcompanyunits
                  });
              }
          });
  }
  getSi_rol() {
      this.si_rolsService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => this._si_rol = data.result
      );
  }
  postSi_user_rol(data) {
      this.si_user_rolsService.insert(data)
      .pipe(take(1))
      .subscribe(
          (result: any) => {
              this.data = result;
              this.confirm();
          });
  }
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idsi_user) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  nombre: this.item.nombre || null,
                  apmat: this.item.apmat || null,
                  appat: this.item.appat || null,
                  email: this.item.email || null,
                  password: this.item.password || null,
                  si_rol_idsi_rol: this.item.si_rol_idsi_rol || null,
                  companyunits_idcompanyunits: this.item.companyunits_idcompanyunits || null,
                  status: this.item.status || null,
          })
          .pipe(take(1))
          .subscribe(
              (data: any) => {
                
                this.data = data;
                this.confirm();
                /* if (data.success) {
                    this.si_user_rol.forEach(element => {
                        this.postSi_user_rol({
                            si_user_idsi_user: data.result.insertId,
                            si_rol_idsi_rol: +element,
                        });
                    });
                } else {
                    this.data = data;
                    this.confirm();
                } */
              });
      }
  }
  onUpdate(): void {
      if (this.form.valid) {
        if (this.item.password === '') {
            this.item.password = null;
        }
          this.service
              .update({
                  idsi_user: this.item.idsi_user,
                  nombre: this.item.nombre,
                  apmat: this.item.apmat,
                  appat: this.item.appat,
                  email: this.item.email,
                  password: (this.item.password) ? this.item.password : this.password, // Solo cambiar si se setea password
                  si_rol_idsi_rol: this.item.si_rol_idsi_rol,
                  companyunits_idcompanyunits: this.item.companyunits_idcompanyunits,
                  status: this.item.status,
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
