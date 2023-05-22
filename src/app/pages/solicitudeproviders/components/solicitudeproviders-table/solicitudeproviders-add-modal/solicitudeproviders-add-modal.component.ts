import { AuthService } from './../../../../../shared/services/auth.service';
import { SolicitudeprovidersService } from './../solicitudeproviders.service';
import { SolicitudeprovidersInterface } from './../solicitudeproviders.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { ProvidersService } from './../../../../providers/components/providers-table/providers.service';
import { ProvidersAddModalComponent } from './../../../../providers/components/providers-table/providers-add-modal/providers-add-modal.component';
import { ProvidersInterface } from './../../../../providers/components/providers-table/providers.interface';
import { Project_servicesService } from './../../../../project_services/components/project_services-table/project_services.service';
import { Project_servicesAddModalComponent } from './../../../../project_services/components/project_services-table/project_services-add-modal/project_services-add-modal.component';
import { Project_servicesInterface } from './../../../../project_services/components/project_services-table/project_services.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { WarehousesInterface } from './../../../../warehouses/components/warehouses-table/warehouses.interface';
import { WarehousesService } from './../../../../warehouses/components/warehouses-table/warehouses.service';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./solicitudeproviders-add-modal.component.scss')],
  templateUrl: './solicitudeproviders-add-modal.component.html'
})
export class SolicitudeprovidersAddModalComponent implements OnInit {
  _provider: ProvidersInterface[] = [];
  _project_service: Project_servicesInterface[] = [];
  providerRewriteable: boolean = false;
  project_serviceRewriteable: boolean = false;
  _warehouse: WarehousesInterface[] = [];

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: SolicitudeprovidersService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private providersService: ProvidersService,
    private project_servicesService: Project_servicesService,
    private warehousesService: WarehousesService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SolicitudeprovidersAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: SolicitudeprovidersInterface
  ) {
    this.form = fb.group({
    'provider_idproviderAC' : ['', this.item.provider_idprovider ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'warehouse_idwarehouseAC' : ['', this.item.warehouse_idwarehouse ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    /* 'project_service_idproject_serviceAC' : ['', this.item.project_service_idproject_service ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null], */
    /* 'statusAC' : ['', this.item.status ? Validators.compose([ Validators.required, Validators.maxLength(45)]) : null], */
    /* 'validatedAC' : [''] */
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.providerRewriteable = true;
        this.project_serviceRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/providers') {
                        this.providerRewriteable = userModules[element].writeable;
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
      this.getProvider();
      this.getWarehouse();
      this.getProject_service();
      // Revisa si es agregar o editar
      if (this.item.idsolicitudeprovider) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
      }
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
  providerAddModalShow() {
      const dialogRef = this.dialog.open(ProvidersAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.providerShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  providerShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getProvider(result.result.insertId);
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
  getProvider(idprovider?: number) {
      this.providersService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._provider = data.result;
              if (idprovider) {
                  this.form.patchValue({
                      provider_idproviderAC: idprovider
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
      if (this.item.idsolicitudeprovider) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  provider_idprovider: this.item.provider_idprovider,
                 /*  project_service_idproject_service: this.item.project_service_idproject_service, */
                  warehouse_idwarehouse: this.item.warehouse_idwarehouse,
                  /* status: this.item.status,
                  validated: this.item.validated */
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
                  idsolicitudeprovider: this.item.idsolicitudeprovider,
                  provider_idprovider: this.item.provider_idprovider,
                 /*  project_service_idproject_service: this.item.project_service_idproject_service, */
                  warehouse_idwarehouse: this.item.warehouse_idwarehouse,
                  /* status: this.item.status,
                  validated: this.item.validated */
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
