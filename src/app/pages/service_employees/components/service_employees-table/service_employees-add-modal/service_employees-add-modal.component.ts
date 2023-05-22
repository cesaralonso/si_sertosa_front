import { AuthService } from './../../../../../shared/services/auth.service';
import { Service_employeesService } from './../service_employees.service';
import { Service_employeesInterface } from './../service_employees.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { EmployeesService } from './../../../../employees/components/employees-table/employees.service';
import { EmployeesAddModalComponent } from './../../../../employees/components/employees-table/employees-add-modal/employees-add-modal.component';
import { EmployeesInterface } from './../../../../employees/components/employees-table/employees.interface';
import { Project_servicesService } from './../../../../project_services/components/project_services-table/project_services.service';
import { Project_servicesAddModalComponent } from './../../../../project_services/components/project_services-table/project_services-add-modal/project_services-add-modal.component';
import { Project_servicesInterface } from './../../../../project_services/components/project_services-table/project_services.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./service_employees-add-modal.component.scss')],
  templateUrl: './service_employees-add-modal.component.html'
})
export class Service_employeesAddModalComponent implements OnInit {
  _employee: EmployeesInterface[] = [];
  _project_service: Project_servicesInterface[] = [];
  employeeRewriteable: boolean = false;
  project_serviceRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: Service_employeesService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private employeesService: EmployeesService,
    private project_servicesService: Project_servicesService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Service_employeesAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Service_employeesInterface
  ) {
    this.form = fb.group({
    'statusAC' : [''],
    'employee_idemployeeAC' : ['', this.item.employee_idemployee ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'project_service_idproject_serviceAC' : ['', this.item.project_service_idproject_service ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'ponderationFinalAC' : [''],
    'observationsAC' : ['', this.item.observations ? Validators.compose([ Validators.maxLength(145)]) : null],
    /* 'urlAC' : ['', this.item.url ? Validators.compose([ Validators.maxLength(300)]) : null],
    'timeAC' : [''], */
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.employeeRewriteable = true;
        this.project_serviceRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/employees') {
                        this.employeeRewriteable = userModules[element].writeable;
                    }
                    if (userModules[element].path === '/pages/project_services') {
                        this.project_serviceRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getEmployee();
      this.getProject_service();
      // Revisa si es agregar o editar
      console.log('this.item', this.item);
      if (this.item.idservice_employee && !this.item.isEmployee) {
          this.accion = "Editar";
      } else if (this.item.idservice_employee && this.item.isEmployee) {
        
        // establecer estatus a finalizado por que acción fué finalizar
        this.item.status = 'COMPLETADA';
        this.accion = "Finalizar";
      } else {
          this.accion = "Agregar";
      }
  }
  employeeAddModalShow() {
      const dialogRef = this.dialog.open(EmployeesAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.employeeShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  employeeShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getEmployee(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
  }
  project_serviceAddModalShow() {
      const dialogRef = this.dialog.open(Project_servicesAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.project_serviceShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  project_serviceShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getProject_service(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
  }
  getEmployee(idemployee?: number) {
      this.employeesService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._employee = data.result;
              if (idemployee) {
                  this.form.patchValue({
                      employee_idemployeeAC: idemployee
                  });
              }
          });
  }
  getProject_service(idproject_service?: number) {
      this.project_servicesService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._project_service = data.result;
              if (idproject_service) {
                  this.form.patchValue({
                      project_service_idproject_serviceAC: idproject_service
                  });
              }
          });
  }
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idservice_employee) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  status: this.item.status || null,
                  employee_idemployee: this.item.employee_idemployee || null,
                  project_service_idproject_service: this.item.project_service_idproject_service || null,
                  /* ponderationFinal: this.item.ponderationFinal || null, */
                  observations: this.item.observations || null,
                  /* url: this.item.url || null,
                  time: this.item.time || null, */
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
                  idservice_employee: this.item.idservice_employee,
                  status: this.item.status,
                  employee_idemployee: this.item.employee_idemployee,
                  project_service_idproject_service: this.item.project_service_idproject_service,
                  ponderationFinal: this.item.ponderationFinal,
                  observations: this.item.observations,
                  /* url: this.item.url,
                  time: this.item.time, */
                  created_by: this.item.created_by // enviar para establecer fecha con cambio de estatus a mismo usuario en back
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
