import { AuthService } from './../../../../../shared/services/auth.service';
import { ValidationsService } from './../validations.service';
import { ValidationsInterface } from './../validations.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { Service_employeesService } from './../../../../service_employees/components/service_employees-table/service_employees.service';
import { Service_employeesAddModalComponent } from './../../../../service_employees/components/service_employees-table/service_employees-add-modal/service_employees-add-modal.component';
import { Service_employeesInterface } from './../../../../service_employees/components/service_employees-table/service_employees.interface';
import { ServicesService } from './../../../../services/components/services-table/services.service';
import { ServicesAddModalComponent } from '../../../../services/components/services-table/services-add-modal/services-add-modal.component';
import { ServicesInterface } from './../../../../services/components/services-table/services.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./validations-add-modal.component.scss')],
  templateUrl: './validations-add-modal.component.html'
})
export class ValidationsAddModalComponent implements OnInit {
  _service_employee: Service_employeesInterface[] = [];
  _service: ServicesInterface[] = [];
  service_employeeRewriteable: boolean = false;
  serviceRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: ValidationsService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private service_employeesService: Service_employeesService,
    private servicesService: ServicesService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ValidationsAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: ValidationsInterface
  ) {
    this.form = fb.group({
    'validatedAC' : [''],
    'service_employee_idservice_employeeAC' : ['', this.item.service_employee_idservice_employee ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    /* 'service_idserviceAC' : ['', this.item.service_idservice ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null], */
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();


    console.log('item', item);

    if (this.user.super) {
        this.service_employeeRewriteable = true;
        this.serviceRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/service_employees') {
                        this.service_employeeRewriteable = userModules[element].writeable;
                    }
                    if (userModules[element].path === '/pages/services') {
                        this.serviceRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getService_employee();
      this.getService();
      // Revisa si es agregar o editar
      if (this.item.idvalidation) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
      }
  }
  service_employeeAddModalShow() {
      const dialogRef = this.dialog.open(Service_employeesAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.service_employeeShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  service_employeeShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getService_employee(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
  }
  serviceAddModalShow() {
      const dialogRef = this.dialog.open(ServicesAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.serviceShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  serviceShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getService(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
  }
  getService_employee(idservice_employee?: number) {
      this.service_employeesService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._service_employee = data.result;
              if (idservice_employee) {
                  this.form.patchValue({
                      service_employee_idservice_employeeAC: idservice_employee
                  });
              }
          });
  }
  getService(idservice?: number) {
      this.servicesService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._service = data.result;
              if (idservice) {
                  this.form.patchValue({
                      service_idserviceAC: idservice
                  });
              }
          });
  }
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idvalidation) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  validated: this.item.validated || null,
                  service_employee_idservice_employee: this.item.service_employee_idservice_employee || null,
                  /* service_idservice: this.item.service_idservice || null, */
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
                  idvalidation: this.item.idvalidation,
                  validated: this.item.validated,
                  service_employee_idservice_employee: this.item.service_employee_idservice_employee,
                  /* service_idservice: this.item.service_idservice, */
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
