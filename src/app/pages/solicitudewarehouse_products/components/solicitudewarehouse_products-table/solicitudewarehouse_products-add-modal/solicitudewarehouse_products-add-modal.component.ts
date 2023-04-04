import { AuthService } from './../../../../../shared/services/auth.service';
import { Solicitudewarehouse_productsService } from './../solicitudewarehouse_products.service';
import { Solicitudewarehouse_productsInterface } from './../solicitudewarehouse_products.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { SolicitudewarehousesService } from './../../../../solicitudewarehouses/components/solicitudewarehouses-table/solicitudewarehouses.service';
import { SolicitudewarehousesAddModalComponent } from './../../../../solicitudewarehouses/components/solicitudewarehouses-table/solicitudewarehouses-add-modal/solicitudewarehouses-add-modal.component';
import { SolicitudewarehousesInterface } from './../../../../solicitudewarehouses/components/solicitudewarehouses-table/solicitudewarehouses.interface';
import { ProductsService } from './../../../../products/components/products-table/products.service';
import { ProductsAddModalComponent } from './../../../../products/components/products-table/products-add-modal/products-add-modal.component';
import { ProductsInterface } from './../../../../products/components/products-table/products.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./solicitudewarehouse_products-add-modal.component.scss')],
  templateUrl: './solicitudewarehouse_products-add-modal.component.html'
})
export class Solicitudewarehouse_productsAddModalComponent implements OnInit {
  _solicitudewarehouse: SolicitudewarehousesInterface[] = [];
  _product: ProductsInterface[] = [];
  solicitudewarehouseRewriteable: boolean = false;
  productRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: Solicitudewarehouse_productsService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private solicitudewarehousesService: SolicitudewarehousesService,
    private productsService: ProductsService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Solicitudewarehouse_productsAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Solicitudewarehouse_productsInterface
  ) {
    this.form = fb.group({
    'solicitudewarehouse_idsolicitudewarehouseAC' : ['', this.item.solicitudewarehouse_idsolicitudewarehouse ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'product_idproductAC' : ['', this.item.product_idproduct ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'quantityAC' : ['', this.item.quantity ? Validators.compose([ Validators.required, Validators.maxLength(11)]) : null],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.solicitudewarehouseRewriteable = true;
        this.productRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/solicitudewarehouses') {
                        this.solicitudewarehouseRewriteable = userModules[element].writeable;
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
      this.getSolicitudewarehouse();
      this.getProduct();
      // Revisa si es agregar o editar
      if (this.item.idsolicitudewarehouse_product) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
      }
  }
  solicitudewarehouseAddModalShow() {
      const dialogRef = this.dialog.open(SolicitudewarehousesAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.solicitudewarehouseShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  solicitudewarehouseShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getSolicitudewarehouse(result.result.insertId);
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
  getSolicitudewarehouse(idsolicitudewarehouse?: number) {
      this.solicitudewarehousesService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._solicitudewarehouse = data.result;
              if (idsolicitudewarehouse) {
                  this.form.patchValue({
                      solicitudewarehouse_idsolicitudewarehouseAC: idsolicitudewarehouse
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
      if (this.item.idsolicitudewarehouse_product) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  solicitudewarehouse_idsolicitudewarehouse: this.item.solicitudewarehouse_idsolicitudewarehouse || null,
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
                  idsolicitudewarehouse_product: this.item.idsolicitudewarehouse_product,
                  solicitudewarehouse_idsolicitudewarehouse: this.item.solicitudewarehouse_idsolicitudewarehouse,
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
