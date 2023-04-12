import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { ProvidersInterface } from './providers.interface';
import { ProvidersResponseInterface } from './providers-response.interface';
import { Component, Injectable, OnInit, Output, ViewChild } from '@angular/core';
import { ProvidersService } from './providers.service';
import { ProvidersAddModalComponent } from './providers-add-modal/providers-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ProductsInterface } from './../../../products/components/products-table/products.interface';
import { ProductsAddModalComponent } from './../../../products/components/products-table/products-add-modal/products-add-modal.component';
import { SolicitudeprovidersInterface } from './../../../solicitudeproviders/components/solicitudeproviders-table/solicitudeproviders.interface';
import { SolicitudeprovidersAddModalComponent } from './../../../solicitudeproviders/components/solicitudeproviders-table/solicitudeproviders-add-modal/solicitudeproviders-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
@Component({
selector: 'providers-table',
templateUrl: './providers-table.html',
styleUrls: ['./providers-table.scss'],

})
export class ProvidersTableComponent implements OnInit {
    data;
    _provider:ProvidersInterface[];
    backpage: boolean;


    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumnsInventario: string[] = [
      'actions',
      'logo',
      'name',
      'skus',
     // 'Cantidad',
     // 'Unidad de compra'


    ];
    displayedColumns: string[] = [
      'actions',
      'logo',
      'name',
      'alias',
      'rfc',
      'billing_email',
      'office_phone',
      'care_contact',
      'care_email',
      'care_phone',
      'skus',
      'status',


    ];
    displayedLabels: string[] = [
      '',
      'Logo',
      'Nombre',
      'Alias',
      'RFC',
      'Correo de facturación',
      'Telefono de oficina',
      'Contacto de atención',
      'Email de atención',
      'Telefono de atención',
      'SKUS',
      'Status',

    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;
    constructor(
      private service: ProvidersService,
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
            if (userModules[element].path === '/pages/providers') {
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
    }
    refill() {
      this.getAll();
    }
    insertProduct(providers: ProvidersInterface) {
      const product: ProductsInterface = {
        provider_idprovider: providers.idprovider
      }
      const dialogRef = this.dialog.open(ProductsAddModalComponent, {
              width: '550px',
              data: product,
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
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewProduct(providers: ProvidersInterface) {
      this.router.navigate([`/pages/products/provider/${providers.idprovider}`]);
    }
    insertSolicitudeprovider(providers: ProvidersInterface) {
      const solicitudeprovider: SolicitudeprovidersInterface = {
        provider_idprovider: providers.idprovider
      }
      const dialogRef = this.dialog.open(SolicitudeprovidersAddModalComponent, {
              width: '550px',
              data: solicitudeprovider,
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
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSolicitudeprovider(providers: ProvidersInterface) {
      this.router.navigate([`/pages/solicitudeproviders/provider/${providers.idprovider}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: ProvidersResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<ProvidersInterface>(data.result);
                  this._provider = data.result;
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
      const dialogRef = this.dialog.open(ProvidersAddModalComponent, {
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
    editModalShow(providers: ProvidersInterface) {
      const dialogRef = this.dialog.open(ProvidersAddModalComponent, {
              width: '550px',
              data: providers
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
          this.service.remove(item.idprovider)
          .pipe(take(1))
          .subscribe(
              (data) => this.showToast(data),
              error => console.log(error),
              () => console.log('Delete completed'),

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
            (data: ProvidersResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<ProvidersInterface>(data.result);
                  this._provider = data.result;
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


