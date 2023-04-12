import { AuthService } from './../../../../../shared/services/auth.service';
import { VehiclesService } from './../vehicles.service';
import { VehiclesInterface } from './../vehicles.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { CompanysService } from './../../../../companys/components/companys-table/companys.service';
import { CompanysAddModalComponent } from './../../../../companys/components/companys-table/companys-add-modal/companys-add-modal.component';
import { CompanysInterface } from './../../../../companys/components/companys-table/companys.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./vehicles-add-modal.component.scss')],
  templateUrl: './vehicles-add-modal.component.html'
})
export class VehiclesAddModalComponent implements OnInit {
  _company: CompanysInterface[] = [];
  companyRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: VehiclesService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private companysService: CompanysService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<VehiclesAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: VehiclesInterface
  ) {
    this.form = fb.group({
    'company_idcompanyAC' : ['', this.item.company_idcompany ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'modelAC' : ['', this.item.model ? Validators.compose([ Validators.required, Validators.maxLength(45)]) : null],
    'typeAC' : ['', this.item.type ? Validators.compose([ Validators.required, Validators.maxLength(45)]) : null],
    'kmAC' : ['', this.item.km ? Validators.compose([ Validators.required, Validators.maxLength(11)]) : null],
    'tradeAC' : ['', this.item.trade ? Validators.compose([ Validators.required, Validators.maxLength(45)]) : null],
    'yearAC' : ['', this.item.year ? Validators.compose([ Validators.maxLength(4)]) : null],
    'numberAC' : ['', this.item.number ? Validators.compose([ Validators.maxLength(4)]) : null],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.companyRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/companys') {
                        this.companyRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getCompany();
      // Revisa si es agregar o editar
      if (this.item.idvehicle) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
      }
  }
  companyAddModalShow() {
      const dialogRef = this.dialog.open(CompanysAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.companyShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  companyShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getCompany(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
  }
  getCompany(idcompany?: number) {
      this.companysService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._company = data.result;
              if (idcompany) {
                  this.form.patchValue({
                      company_idcompanyAC: idcompany
                  });
              }
          });
  }
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idvehicle) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  company_idcompany: this.item.company_idcompany || null,
                  model: this.item.model || null,
                  type: this.item.type || null,
                  km: this.item.km || null,
                  trade: this.item.trade || null,
                  year: this.item.year || null,
                  number: this.item.number || null
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
                  idvehicle: this.item.idvehicle,
                  company_idcompany: this.item.company_idcompany,
                  model: this.item.model,
                  type: this.item.type,
                  km: this.item.km,
                  trade: this.item.trade,
                  year: this.item.year,
                  number: this.item.number
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
