import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { ProductsInterface } from './products.interface';
import { ProductsResponseInterface } from './products-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from './products.service';
import { ProductsAddModalComponent } from './products-add-modal/products-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { OrderinsInterface } from './../../../orderins/components/orderins-table/orderins.interface';
import { OrderinsAddModalComponent } from './../../../orderins/components/orderins-table/orderins-add-modal/orderins-add-modal.component';
import { OrderoutsInterface } from './../../../orderouts/components/orderouts-table/orderouts.interface';
import { OrderoutsAddModalComponent } from './../../../orderouts/components/orderouts-table/orderouts-add-modal/orderouts-add-modal.component';
import { Solicitudeprovider_productsInterface } from './../../../solicitudeprovider_products/components/solicitudeprovider_products-table/solicitudeprovider_products.interface';
import { Solicitudeprovider_productsAddModalComponent } from './../../../solicitudeprovider_products/components/solicitudeprovider_products-table/solicitudeprovider_products-add-modal/solicitudeprovider_products-add-modal.component';
import { Solicitudewarehouse_productsInterface } from './../../../solicitudewarehouse_products/components/solicitudewarehouse_products-table/solicitudewarehouse_products.interface';
import { Solicitudewarehouse_productsAddModalComponent } from './../../../solicitudewarehouse_products/components/solicitudewarehouse_products-table/solicitudewarehouse_products-add-modal/solicitudewarehouse_products-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'products-table',
templateUrl: './products-table.html',
styleUrls: ['./products-table.scss'],
})
export class ProductsTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'name',
      'description',
      'provider_provider_idprovider',
      'family_family_idfamily',
    ];
    displayedLabels: string[] = [
      '',
      'Nombre',
      'Descripción',
      'Proveedor',
      'Familia',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: ProductsService, 
      private toastrService: ToasterService, 
      private authService: AuthService, 
      private route: ActivatedRoute, 
      private commonService: CommonService,
      public dialog: MatDialog,
      private router: Router) {

      // Buscar permisos del usuario en el módulo
      this.user = this.authService.useJwtHelper();
      
      if (this.user.super) {
        this.updateable = true;
        this.deleteable = true;
        this.writeable = true;
      } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
          for (const element in userModules) {
            if (userModules[element].path === '/pages/products') {
              this.updateable = userModules[element].updateable;
              this.deleteable = userModules[element].deleteable;
              this.writeable = userModules[element].writeable;
            }
          }
        }
      }
    }
    ngOnInit() {
      this.refill();
    }
    ngOnDestroy() {
        this.routeParamsSubs.unsubscribe();
    }
    refill() { 
      this.routeParamsSubs = this.route.params.subscribe(params => {
        if (params['idfamily'] !== undefined) {
          const idfamily = +params['idfamily'];
          this.findByIdFamily(idfamily);
          this.backpage = true;
        }
        if (params['idprovider'] !== undefined) {
          const idprovider = +params['idprovider'];
          this.findByIdProvider(idprovider);
          this.backpage = true;
        }
        if (!this.backpage) {
          this.getAll();
        }
      });
    }
    private findByIdFamily(id: number): void {
      this.service
        .findByIdFamily(id)
        .pipe(take(1))
        .subscribe(
            (data: ProductsResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<ProductsInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    private findByIdProvider(id: number): void {
      this.service
        .findByIdProvider(id)
        .pipe(take(1))
        .subscribe(
            (data: ProductsResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<ProductsInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    backPage() {
        window.history.back();
    }
    insertOrderin(products: ProductsInterface) {
      const orderin: OrderinsInterface = {
        product_idproduct: products.idproduct
      }
      const dialogRef = this.dialog.open(OrderinsAddModalComponent, {
              width: '550px',
              data: orderin,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.orderinShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    orderinShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewOrderin(products: ProductsInterface) {
      this.router.navigate([`/pages/orderins/product/${products.idproduct}`]);
    }
    insertOrderout(products: ProductsInterface) {
      const orderout: OrderoutsInterface = {
        product_idproduct: products.idproduct
      }
      const dialogRef = this.dialog.open(OrderoutsAddModalComponent, {
              width: '550px',
              data: orderout,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.orderoutShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    orderoutShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewOrderout(products: ProductsInterface) {
      this.router.navigate([`/pages/orderouts/product/${products.idproduct}`]);
    }
    insertSolicitudeprovider_product(products: ProductsInterface) {
      const solicitudeprovider_product: Solicitudeprovider_productsInterface = {
        product_idproduct: products.idproduct
      }
      const dialogRef = this.dialog.open(Solicitudeprovider_productsAddModalComponent, {
              width: '550px',
              data: solicitudeprovider_product,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.solicitudeprovider_productShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    solicitudeprovider_productShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSolicitudeprovider_product(products: ProductsInterface) {
      this.router.navigate([`/pages/solicitudeprovider_products/product/${products.idproduct}`]);
    }
    insertSolicitudewarehouse_product(products: ProductsInterface) {
      const solicitudewarehouse_product: Solicitudewarehouse_productsInterface = {
        product_idproduct: products.idproduct
      }
      const dialogRef = this.dialog.open(Solicitudewarehouse_productsAddModalComponent, {
              width: '550px',
              data: solicitudewarehouse_product,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.solicitudewarehouse_productShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    solicitudewarehouse_productShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSolicitudewarehouse_product(products: ProductsInterface) {
      this.router.navigate([`/pages/solicitudewarehouse_products/product/${products.idproduct}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: ProductsResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<ProductsInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    addModalShow() {
      const dialogRef = this.dialog.open(ProductsAddModalComponent, {
              width: '550px',
              data: {}
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.showToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    editModalShow(products: ProductsInterface) {
      const dialogRef = this.dialog.open(ProductsAddModalComponent, {
              width: '550px',
              data: products
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.showToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    onDeleteConfirm(event, item): void {
      if (window.confirm('¿Estas seguro de querer eliminar este registro?')) {
          this.service.remove(item.idproduct)
          .pipe(take(1))
          .subscribe(
              (data) => this.showToast(data),
              error => console.log(error),
              () => console.log('Delete completed')
          );
      } else {
          console.log('item cancelado');
      }
    }
    showToast(result) {
      if (result.success) {
        this.toastrService.success(result.message);
        this.refill();
      } else {
        this.toastrService.error(result.message);
      }
    }
    private getAll(): void {
      this.service
        .all()
        .pipe(take(1))
        .subscribe(
            (data: ProductsResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<ProductsInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    descargarCSV(data, reportTitle, showLabel) {
        const arrayReport = [];
        let report = [];
        data.filteredData.forEach(element => {
        report = [];
        for(let column in this.displayedColumns) {
            const key = this.displayedLabels[column];
            if (key) {
            report['"'+ key +'"'] = element[this.displayedColumns[column]];
            }
        }
        arrayReport.push(report);
        });
        this.commonService.JSONToCSVConvertor(arrayReport, reportTitle, showLabel);
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.data.filter = filterValue.trim().toLowerCase();
    }
  }
