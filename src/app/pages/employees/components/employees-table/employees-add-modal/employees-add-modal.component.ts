import { AuthService } from './../../../../../shared/services/auth.service';
import { EmployeesService } from './../employees.service';
import { EmployeesInterface } from './../employees.interface';
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
import { CompanyunitssService } from './../../../../companyunitss/components/companyunitss-table/companyunitss.service';
import { CompanyunitssAddModalComponent } from './../../../../companyunitss/components/companyunitss-table/companyunitss-add-modal/companyunitss-add-modal.component';
import { CompanyunitssInterface } from './../../../../companyunitss/components/companyunitss-table/companyunitss.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./employees-add-modal.component.scss')],
  templateUrl: './employees-add-modal.component.html'
})
export class EmployeesAddModalComponent implements OnInit {
  _si_user: Si_usersInterface[] = [];
  _companyunits: CompanyunitssInterface[] = [];
  si_userRewriteable: boolean = false;
  companyunitsRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: EmployeesService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private si_usersService: Si_usersService,
    private companyunitssService: CompanyunitssService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EmployeesAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: EmployeesInterface
  ) {
    this.form = fb.group({
    'nameAC' : ['', this.item.name ? Validators.compose([ Validators.required, Validators.maxLength(145)]) : null],
    'emailAC' : ['', this.item.email ? Validators.compose([ Validators.required, Validators.maxLength(85)]) : null],
    'si_user_idsi_userAC' : ['', this.item.si_user_idsi_user ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'companyunits_idcompanyunitsAC' : ['', this.item.companyunits_idcompanyunits ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'codeAC' : ['', this.item.code ? Validators.compose([ Validators.maxLength(45)]) : null],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.si_userRewriteable = true;
        this.companyunitsRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/si_users') {
                        this.si_userRewriteable = userModules[element].writeable;
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
      this.getSi_user();
      this.getCompanyunits();
      // Revisa si es agregar o editar
      if (this.item.idemployee) {
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
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idemployee) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  name: this.item.name || null,
                  email: this.item.email || null,
                  si_user_idsi_user: this.item.si_user_idsi_user || null,
                  companyunits_idcompanyunits: this.item.companyunits_idcompanyunits || null,
                  code: this.item.code || null,
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
                  idemployee: this.item.idemployee,
                  name: this.item.name,
                  email: this.item.email,
                  si_user_idsi_user: this.item.si_user_idsi_user,
                  companyunits_idcompanyunits: this.item.companyunits_idcompanyunits,
                  code: this.item.code,
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
