import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { OrderinsAddModalComponent } from './../../../../pages/orderins/components/orderins-table/orderins-add-modal/orderins-add-modal.component';
import { OrderinsService } from './../../../../pages/orderins/components/orderins-table/orderins.service';
import { OrderinsInterface } from './../../../../pages/orderins/components/orderins-table/orderins.interface';
import { OrderinsResponseInterface } from './../../../../pages/orderins/components/orderins-table/orderins-response.interface';
import { OrderoutsAddModalComponent } from 'app/pages/orderouts/components/orderouts-table/orderouts-add-modal/orderouts-add-modal.component';

@Component({
selector: 'warehouse-inventary-table',
templateUrl: './warehouse-inventary.component.html',
styleUrls: ['./warehouse-inventary.component.scss'],
})
export class WarehouseinventaryTableComponent implements OnInit {
    data;
    backpage: boolean;
    idwarehouse: number;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'warehouse_warehouse_idwarehouse',
      'product_product_idproduct',
      'provider_provider_idprovider',
      'quantity'
    ];
    displayedLabels: string[] = [
      '',
      'Almacen',
      'Producto',
      'Proveedor',
      'Cantidad'
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: OrderinsService, 
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
            if (userModules[element].path === '/pages/orderins') {
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
        if (params['idwarehouse'] !== undefined) {
          this.idwarehouse = +params['idwarehouse'];
          this.findInventaryByIdWarehouse(this.idwarehouse);
          this.backpage = true;
        }
      });
    }

    addModalShowOrderin(orderin: OrderinsInterface) {
        const dialogRef = this.dialog.open(OrderinsAddModalComponent, {
                width: '550px',
                data: {
                    warehouse_idwarehouse: this.idwarehouse,
                    product_idproduct: orderin.product_idproduct
                }
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
    
    addModalShowOrderout(orderin: OrderinsInterface) {
        const dialogRef = this.dialog.open(OrderoutsAddModalComponent, {
                width: '550px',
                data: {
                    warehouse_idwarehouse: this.idwarehouse,
                    product_idproduct: orderin.product_idproduct
                }
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

    private findInventaryByIdWarehouse(id: number): void {
      this.service
        .findInventaryByIdWarehouse(id)
        .pipe(take(1))
        .subscribe(
            (data: OrderinsResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<OrderinsInterface>(data.result);
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
            (data: OrderinsResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<OrderinsInterface>(data.result);
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
      const dialogRef = this.dialog.open(OrderinsAddModalComponent, {
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
    editModalShow(orderins: OrderinsInterface) {
      const dialogRef = this.dialog.open(OrderinsAddModalComponent, {
              width: '550px',
              data: orderins
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
          this.service.remove(item.idorderin)
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
