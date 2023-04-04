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
