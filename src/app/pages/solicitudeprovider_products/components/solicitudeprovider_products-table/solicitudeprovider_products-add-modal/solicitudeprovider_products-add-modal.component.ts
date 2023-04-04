import { AuthService } from './../../../../../shared/services/auth.service';
import { Solicitudeprovider_productsService } from './../solicitudeprovider_products.service';
import { Solicitudeprovider_productsInterface } from './../solicitudeprovider_products.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { SolicitudeprovidersService } from './../../../../solicitudeproviders/components/solicitudeproviders-table/solicitudeproviders.service';
import { SolicitudeprovidersAddModalComponent } from './../../../../solicitudeproviders/components/solicitudeproviders-table/solicitudeproviders-add-modal/solicitudeproviders-add-modal.component';
import { SolicitudeprovidersInterface } from './../../../../solicitudeproviders/components/solicitudeproviders-table/solicitudeproviders.interface';
import { ProductsService } from './../../../../products/components/products-table/products.service';
import { ProductsAddModalComponent } from './../../../../products/components/products-table/products-add-modal/products-add-modal.component';
import { ProductsInterface } from './../../../../products/components/products-table/products.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./solicitudeprovider_products-add-modal.component.scss')],
  templateUrl: './solicitudeprovider_products-add-modal.component.html'
})
export class Solicitudeprovider_productsAddModalComponent implements OnInit {
  _solicitudeprovider: SolicitudeprovidersInterface[] = [];
  _product: ProductsInterface[] = [];
  solicitudeproviderRewriteable: boolean = false;
  productRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: Solicitudeprovider_productsService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private solicitudeprovidersService: SolicitudeprovidersService,
    private productsService: ProductsService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Solicitudeprovider_productsAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Solicitudeprovider_productsInterface
  ) {
    this.form = fb.group({
    'solicitudeprovider_idsolicitudeproviderAC' : ['', this.item.solicitudeprovider_idsolicitudeprovider ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'product_idproductAC' : ['', this.item.product_idproduct ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'quantityAC' : ['', this.item.quantity ? Validators.compose([ Validators.required, Validators.maxLength(11)]) : null],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.solicitudeproviderRewriteable = true;
        this.productRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/solicitudeproviders') {
                        this.solicitudeproviderRewriteable = userModules[element].writeable;
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
      this.getSolicitudeprovider();
      this.getProduct();
      // Revisa si es agregar o editar
      if (this.item.idsolicitudeprovider_product) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
      }
  }
  solicitudeproviderAddModalShow() {
      const dialogRef = this.dialog.open(SolicitudeprovidersAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.solicitudeproviderShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  solicitudeproviderShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getSolicitudeprovider(result.result.insertId);
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
  getSolicitudeprovider(idsolicitudeprovider?: number) {
      this.solicitudeprovidersService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._solicitudeprovider = data.result;
              if (idsolicitudeprovider) {
                  this.form.patchValue({
                      solicitudeprovider_idsolicitudeproviderAC: idsolicitudeprovider
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
      if (this.item.idsolicitudeprovider_product) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  solicitudeprovider_idsolicitudeprovider: this.item.solicitudeprovider_idsolicitudeprovider || null,
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
                  idsolicitudeprovider_product: this.item.idsolicitudeprovider_product,
                  solicitudeprovider_idsolicitudeprovider: this.item.solicitudeprovider_idsolicitudeprovider,
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
