import { AuthService } from './../../../../../shared/services/auth.service';
import { SolicitudewarehousesService } from './../solicitudewarehouses.service';
import { SolicitudewarehousesInterface } from './../solicitudewarehouses.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { Project_servicesService } from './../../../../project_services/components/project_services-table/project_services.service';
import { Project_servicesAddModalComponent } from './../../../../project_services/components/project_services-table/project_services-add-modal/project_services-add-modal.component';
import { Project_servicesInterface } from './../../../../project_services/components/project_services-table/project_services.interface';
import { WarehousesService } from './../../../../warehouses/components/warehouses-table/warehouses.service';
import { WarehousesAddModalComponent } from './../../../../warehouses/components/warehouses-table/warehouses-add-modal/warehouses-add-modal.component';
import { WarehousesInterface } from './../../../../warehouses/components/warehouses-table/warehouses.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./solicitudewarehouses-add-modal.component.scss')],
  templateUrl: './solicitudewarehouses-add-modal.component.html'
})
export class SolicitudewarehousesAddModalComponent implements OnInit {
  _project_service: Project_servicesInterface[] = [];
  _warehouse: WarehousesInterface[] = [];
  project_serviceRewriteable: boolean = false;
  warehouseRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: SolicitudewarehousesService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private project_servicesService: Project_servicesService,
    private warehousesService: WarehousesService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SolicitudewarehousesAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: SolicitudewarehousesInterface
  ) {
    this.form = fb.group({
    'project_service_idproject_serviceAC' : ['', this.item.project_service_idproject_service ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'warehouse_idwarehouseAC' : ['', this.item.warehouse_idwarehouse ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'statusAC' : ['', this.item.status ? Validators.compose([ Validators.required, Validators.maxLength(45)]) : null],
    'validatedAC' : ['']
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.project_serviceRewriteable = true;
        this.warehouseRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/project_services') {
                        this.project_serviceRewriteable = userModules[element].writeable;
                    }
                    if (userModules[element].path === '/pages/warehouses') {
                        this.warehouseRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getProject_service();
      this.getWarehouse();
      // Revisa si es agregar o editar
      if (this.item.idsolicitudewarehouse) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
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
  warehouseAddModalShow() {
      const dialogRef = this.dialog.open(WarehousesAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.warehouseShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  warehouseShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getWarehouse(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
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
  getWarehouse(idwarehouse?: number) {
      this.warehousesService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._warehouse = data.result;
              if (idwarehouse) {
                  this.form.patchValue({
                      warehouse_idwarehouseAC: idwarehouse
                  });
              }
          });
  }
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idsolicitudewarehouse) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  project_service_idproject_service: this.item.project_service_idproject_service,
                  warehouse_idwarehouse: this.item.warehouse_idwarehouse,
                  status: this.item.status,
                  validated: this.item.validated
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
                  idsolicitudewarehouse: this.item.idsolicitudewarehouse,
                  project_service_idproject_service: this.item.project_service_idproject_service,
                  warehouse_idwarehouse: this.item.warehouse_idwarehouse,
                  status: this.item.status,
                  validated: this.item.validated
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
