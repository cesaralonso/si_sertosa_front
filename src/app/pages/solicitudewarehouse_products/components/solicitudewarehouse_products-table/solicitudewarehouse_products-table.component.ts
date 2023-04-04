import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { Solicitudewarehouse_productsInterface } from './solicitudewarehouse_products.interface';
import { Solicitudewarehouse_productsResponseInterface } from './solicitudewarehouse_products-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Solicitudewarehouse_productsService } from './solicitudewarehouse_products.service';
import { Solicitudewarehouse_productsAddModalComponent } from './solicitudewarehouse_products-add-modal/solicitudewarehouse_products-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'solicitudewarehouse_products-table',
templateUrl: './solicitudewarehouse_products-table.html',
styleUrls: ['./solicitudewarehouse_products-table.scss'],
})
export class Solicitudewarehouse_productsTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'solicitudewarehouse_solicitudewarehouse_idsolicitudewarehouse',
      'product_product_idproduct',
      'quantity',
    ];
    displayedLabels: string[] = [
      '',
      'Solicitud',
      'Producto',
      'Cantidad',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: Solicitudewarehouse_productsService, 
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
            if (userModules[element].path === '/pages/solicitudewarehouse_products') {
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
        if (params['idproduct'] !== undefined) {
          const idproduct = +params['idproduct'];
          this.findByIdProduct(idproduct);
          this.backpage = true;
        }
        if (params['idsolicitudewarehouse'] !== undefined) {
          const idsolicitudewarehouse = +params['idsolicitudewarehouse'];
          this.findByIdSolicitudewarehouse(idsolicitudewarehouse);
          this.backpage = true;
        }
        if (!this.backpage) {
          this.getAll();
        }
      });
    }
    private findByIdProduct(id: number): void {
      this.service
        .findByIdProduct(id)
        .pipe(take(1))
        .subscribe(
            (data: Solicitudewarehouse_productsResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<Solicitudewarehouse_productsInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    private findByIdSolicitudewarehouse(id: number): void {
      this.service
        .findByIdSolicitudewarehouse(id)
        .pipe(take(1))
        .subscribe(
            (data: Solicitudewarehouse_productsResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<Solicitudewarehouse_productsInterface>(data.result);
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
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: Solicitudewarehouse_productsResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Solicitudewarehouse_productsInterface>(data.result);
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
      const dialogRef = this.dialog.open(Solicitudewarehouse_productsAddModalComponent, {
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
    editModalShow(solicitudewarehouse_products: Solicitudewarehouse_productsInterface) {
      const dialogRef = this.dialog.open(Solicitudewarehouse_productsAddModalComponent, {
              width: '550px',
              data: solicitudewarehouse_products
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
          this.service.remove(item.idsolicitudewarehouse_product)
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
            (data: Solicitudewarehouse_productsResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Solicitudewarehouse_productsInterface>(data.result);
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
