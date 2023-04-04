import { AuthService } from './../../../../../shared/services/auth.service';
import { OrderoutsService } from './../orderouts.service';
import { OrderoutsInterface } from './../orderouts.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { WarehousesService } from './../../../../warehouses/components/warehouses-table/warehouses.service';
import { WarehousesAddModalComponent } from './../../../../warehouses/components/warehouses-table/warehouses-add-modal/warehouses-add-modal.component';
import { WarehousesInterface } from './../../../../warehouses/components/warehouses-table/warehouses.interface';
import { ProductsService } from './../../../../products/components/products-table/products.service';
import { ProductsAddModalComponent } from './../../../../products/components/products-table/products-add-modal/products-add-modal.component';
import { ProductsInterface } from './../../../../products/components/products-table/products.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./orderouts-add-modal.component.scss')],
  templateUrl: './orderouts-add-modal.component.html'
})
export class OrderoutsAddModalComponent implements OnInit {
  _warehouse: WarehousesInterface[] = [];
  _product: ProductsInterface[] = [];
  warehouseRewriteable: boolean = false;
  productRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: OrderoutsService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private warehousesService: WarehousesService,
    private productsService: ProductsService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OrderoutsAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: OrderoutsInterface
  ) {
    this.form = fb.group({
    'warehouse_idwarehouseAC' : ['', this.item.warehouse_idwarehouse ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'product_idproductAC' : ['', this.item.product_idproduct ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'quantityAC' : ['', this.item.quantity ? Validators.compose([ Validators.required, Validators.maxLength(11)]) : null],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.warehouseRewriteable = true;
        this.productRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/warehouses') {
                        this.warehouseRewriteable = userModules[element].writeable;
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
      this.getWarehouse();
      this.getProduct();
      // Revisa si es agregar o editar
      if (this.item.idorderout) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
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
      if (this.item.idorderout) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  warehouse_idwarehouse: this.item.warehouse_idwarehouse || null,
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
                  idorderout: this.item.idorderout,
                  warehouse_idwarehouse: this.item.warehouse_idwarehouse,
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
