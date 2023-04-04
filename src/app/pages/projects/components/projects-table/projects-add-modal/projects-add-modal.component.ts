import { AuthService } from './../../../../../shared/services/auth.service';
import { ProjectsService } from './../projects.service';
import { ProjectsInterface } from './../projects.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { CompanyunitssService } from './../../../../companyunitss/components/companyunitss-table/companyunitss.service';
import { CompanyunitssAddModalComponent } from './../../../../companyunitss/components/companyunitss-table/companyunitss-add-modal/companyunitss-add-modal.component';
import { CompanyunitssInterface } from './../../../../companyunitss/components/companyunitss-table/companyunitss.interface';
import { VehiclesService } from './../../../../vehicles/components/vehicles-table/vehicles.service';
import { VehiclesAddModalComponent } from './../../../../vehicles/components/vehicles-table/vehicles-add-modal/vehicles-add-modal.component';
import { VehiclesInterface } from './../../../../vehicles/components/vehicles-table/vehicles.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./projects-add-modal.component.scss')],
  templateUrl: './projects-add-modal.component.html'
})
export class ProjectsAddModalComponent implements OnInit {
  _companyunits: CompanyunitssInterface[] = [];
  _vehicle: VehiclesInterface[] = [];
  companyunitsRewriteable: boolean = false;
  vehicleRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: ProjectsService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private companyunitssService: CompanyunitssService,
    private vehiclesService: VehiclesService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProjectsAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: ProjectsInterface
  ) {
    this.form = fb.group({
    'nameAC' : ['', this.item.name ? Validators.compose([ Validators.required, Validators.maxLength(45)]) : null],
    'companyunits_idcompanyunitsAC' : ['', this.item.companyunits_idcompanyunits ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'vehicle_idvehicleAC' : ['', this.item.vehicle_idvehicle ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.companyunitsRewriteable = true;
        this.vehicleRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/companyunitss') {
                        this.companyunitsRewriteable = userModules[element].writeable;
                    }
                    if (userModules[element].path === '/pages/vehicles') {
                        this.vehicleRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getCompanyunits();
      this.getVehicle();
      // Revisa si es agregar o editar
      if (this.item.idproject) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
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
  vehicleAddModalShow() {
      const dialogRef = this.dialog.open(VehiclesAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.vehicleShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  vehicleShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getVehicle(result.result.insertId);
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
  getVehicle(idvehicle?: number) {
      this.vehiclesService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._vehicle = data.result;
              if (idvehicle) {
                  this.form.patchValue({
                      vehicle_idvehicleAC: idvehicle
                  });
              }
          });
  }
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idproject) {
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
                  companyunits_idcompanyunits: this.item.companyunits_idcompanyunits || null,
                  vehicle_idvehicle: this.item.vehicle_idvehicle || null,
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
                  idproject: this.item.idproject,
                  name: this.item.name,
                  companyunits_idcompanyunits: this.item.companyunits_idcompanyunits,
                  vehicle_idvehicle: this.item.vehicle_idvehicle,
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
