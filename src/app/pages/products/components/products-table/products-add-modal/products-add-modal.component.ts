import { AuthService } from './../../../../../shared/services/auth.service';
import { ProductsService } from './../products.service';
import { ProductsInterface } from './../products.interface';
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
import { FamilysService } from './../../../../familys/components/familys-table/familys.service';
import { FamilysAddModalComponent } from './../../../../familys/components/familys-table/familys-add-modal/familys-add-modal.component';
import { FamilysInterface } from './../../../../familys/components/familys-table/familys.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./products-add-modal.component.scss')],
  templateUrl: './products-add-modal.component.html'
})
export class ProductsAddModalComponent implements OnInit {
  _provider: ProvidersInterface[] = [];
  _family: FamilysInterface[] = [];
  providerRewriteable: boolean = false;
  familyRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: ProductsService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private providersService: ProvidersService,
    private familysService: FamilysService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProductsAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: ProductsInterface
  ) {
    this.form = fb.group({
    'nameAC' : ['', this.item.name ? Validators.compose([ Validators.required, Validators.maxLength(45)]) : null],
    'descriptionAC' : ['', this.item.description ? Validators.compose([ Validators.maxLength(345)]) : null],
    'provider_idproviderAC' : ['', this.item.provider_idprovider ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'family_idfamilyAC' : ['', this.item.family_idfamily ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'skuAC' : ['', this.item.sku ? Validators.compose([ Validators.required, Validators.maxLength(16)]) : null],
    'akaAC' : ['', this.item.aka ? Validators.compose([ Validators.required, Validators.maxLength(100)]) : null],
    'typeAC' : [''],
    'costAC' : ['', this.item.cost ? Validators.compose([ Validators.required, Validators.maxLength(11)]) : null],
    'minAC' : ['', this.item.min ? Validators.compose([ Validators.required, Validators.maxLength(11)]) : null],
    'idAC' : ['', this.item.id ? Validators.compose([ Validators.required, Validators.maxLength(20)]) : null],
    'reorderpointAC' : ['', this.item.reorderpoint ? Validators.compose([ Validators.required, Validators.maxLength(11)]) : null],
    'maxAC' : ['', this.item.max ? Validators.compose([ Validators.required, Validators.maxLength(11)]) : null],
    'caducityAC' : [''],
    'unitinAC' : [''],
    'unitoutAC' : [''],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.providerRewriteable = true;
        this.familyRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/providers') {
                        this.providerRewriteable = userModules[element].writeable;
                    }
                    if (userModules[element].path === '/pages/familys') {
                        this.familyRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getProvider();
      this.getFamily();
      // Revisa si es agregar o editar
      if (this.item.idproduct) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
      }
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
  familyAddModalShow() {
      const dialogRef = this.dialog.open(FamilysAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.familyShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  familyShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getFamily(result.result.insertId);
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
  getFamily(idfamily?: number) {
      this.familysService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._family = data.result;
              if (idfamily) {
                  this.form.patchValue({
                      family_idfamilyAC: idfamily
                  });
              }
          });
  }
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idproduct) {
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
                  description: this.item.description || null,
                  provider_idprovider: this.item.provider_idprovider || null,
                  family_idfamily: this.item.family_idfamily || null,
                  sku: this.item.sku || null,
                  aka: this.item.aka || null,
                  type: this.item.type || null,
                  cost: this.item.cost || null,
                  min: this.item.min || null,
                  id: this.item.id || null,
                  reorderpoint: this.item.reorderpoint || null,
                  max: this.item.max || null,
                  caducity: this.item.caducity || null,
                  unitin: this.item.unitin || null,
                  unitout: this.item.unitout || null,
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
                  idproduct: this.item.idproduct,
                  name: this.item.name,
                  description: this.item.description,
                  provider_idprovider: this.item.provider_idprovider,
                  family_idfamily: this.item.family_idfamily,
                  sku: this.item.sku,
                  aka: this.item.aka,
                  type: this.item.type,
                  cost: this.item.cost,
                  min: this.item.min,
                  id: this.item.id,
                  reorderpoint: this.item.reorderpoint,
                  max: this.item.max,
                  caducity: this.item.caducity,
                  unitin: this.item.unitin,
                  unitout: this.item.unitout,
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
