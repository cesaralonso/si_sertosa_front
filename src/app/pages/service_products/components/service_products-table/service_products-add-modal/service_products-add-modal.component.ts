import { AuthService } from './../../../../../shared/services/auth.service';
import { Service_productsService } from './../service_products.service';
import { Service_productsInterface } from './../service_products.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { ServicesService } from './../../../../services/components/services-table/services.service';
import { ServicesAddModalComponent } from '../../../../services/components/services-table/services-add-modal/services-add-modal.component';
import { ServicesInterface } from './../../../../services/components/services-table/services.interface';
import { ProductsService } from './../../../../products/components/products-table/products.service';
import { ProductsAddModalComponent } from './../../../../products/components/products-table/products-add-modal/products-add-modal.component';
import { ProductsInterface } from './../../../../products/components/products-table/products.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./service_products-add-modal.component.scss')],
  templateUrl: './service_products-add-modal.component.html'
})
export class Service_productsAddModalComponent implements OnInit {
  _service: ServicesInterface[] = [];
  _product: ProductsInterface[] = [];
  serviceRewriteable: boolean = false;
  productRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: Service_productsService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private servicesService: ServicesService,
    private productsService: ProductsService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Service_productsAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Service_productsInterface
  ) {
    this.form = fb.group({
    'service_idserviceAC' : ['', this.item.service_idservice ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'product_idproductAC' : ['', this.item.product_idproduct ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'quantityAC' : ['', this.item.quantity ? Validators.compose([ Validators.required, Validators.maxLength(11)]) : null],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.serviceRewriteable = true;
        this.productRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/services') {
                        this.serviceRewriteable = userModules[element].writeable;
                    }
                    if (userModules[element].path === '/pages/products') {
                        this.productRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getService();
      this.getProduct();
      // Revisa si es agregar o editar
      if (this.item.idservice_product) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
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
  productAddModalShow() {
      const dialogRef = this.dialog.open(ProductsAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.productShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  productShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getProduct(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
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
  getProduct(idproduct?: number) {
      this.productsService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._product = data.result;
              if (idproduct) {
                  this.form.patchValue({
                      product_idproductAC: idproduct
                  });
              }
          });
  }
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idservice_product) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  service_idservice: this.item.service_idservice || null,
                  product_idproduct: this.item.product_idproduct || null,
                  quantity: this.item.quantity || null,
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
                  idservice_product: this.item.idservice_product,
                  service_idservice: this.item.service_idservice,
                  product_idproduct: this.item.product_idproduct,
                  quantity: this.item.quantity,
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
