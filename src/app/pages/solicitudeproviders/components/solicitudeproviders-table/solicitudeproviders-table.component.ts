import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { SolicitudeprovidersInterface } from './solicitudeproviders.interface';
import { SolicitudeprovidersResponseInterface } from './solicitudeproviders-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SolicitudeprovidersService } from './solicitudeproviders.service';
import { SolicitudeprovidersAddModalComponent } from './solicitudeproviders-add-modal/solicitudeproviders-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Solicitudeprovider_productsInterface } from './../../../solicitudeprovider_products/components/solicitudeprovider_products-table/solicitudeprovider_products.interface';
import { Solicitudeprovider_productsAddModalComponent } from './../../../solicitudeprovider_products/components/solicitudeprovider_products-table/solicitudeprovider_products-add-modal/solicitudeprovider_products-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AuthorizeComponent } from 'app/shared/components/authorize/authorize.component';

@Component({
selector: 'solicitudeproviders-table',
templateUrl: './solicitudeproviders-table.html',
styleUrls: ['./solicitudeproviders-table.scss'],
})
export class SolicitudeprovidersTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'provider_provider_idprovider',
      /* 'project_service_project_service_idproject_service', */
      'warehouse_warehouse_idwarehouse',
      'status',
      'created_at',
      'validated'
    ];
    displayedLabels: string[] = [
      '',
      'Proveedor',
      /* 'Reparación', */
      'Almacen',
      'Status',
      'Fecha',
      'Validada',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: SolicitudeprovidersService, 
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
            if (userModules[element].path === '/pages/solicitudeproviders') {
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
        if (params['idproject_service'] !== undefined) {
          const idproject_service = +params['idproject_service'];
          this.findByIdProject_service(idproject_service);
          this.backpage = true;
        }
        if (params['idprovider'] !== undefined) {
          const idprovider = +params['idprovider'];
          this.findByIdProvider(idprovider);
          this.backpage = true;
        }
        if (params['idwarehouse'] !== undefined && params['idprovider'] !== undefined) {
          const idwarehouse = +params['idwarehouse'];
          const idprovider = +params['idprovider'];
          this.findByIdWarehouseIdProvider(idwarehouse, idprovider);
          this.backpage = true;
        }
        if (!this.backpage) {
          this.getAll();
        }
      });
    }
    private findByIdProject_service(id: number): void {
      this.service
        .findByIdProject_service(id)
        .pipe(take(1))
        .subscribe(
            (data: SolicitudeprovidersResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<SolicitudeprovidersInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    private findByIdWarehouseIdProvider(idwarehouse:number, idprovider: number): void {
      this.service
        .findByIdWarehouseIdProvider(idwarehouse, idprovider)
        .pipe(take(1))
        .subscribe(
            (data: SolicitudeprovidersResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<SolicitudeprovidersInterface>(data.result);
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
            (data: SolicitudeprovidersResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<SolicitudeprovidersInterface>(data.result);
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
    insertSolicitudeprovider_product(solicitudeproviders: SolicitudeprovidersInterface) {
      const solicitudeprovider_product: Solicitudeprovider_productsInterface = {
        solicitudeprovider_idsolicitudeprovider: solicitudeproviders.idsolicitudeprovider
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
    viewSolicitudeprovider_product(solicitudeproviders: SolicitudeprovidersInterface) {
      this.router.navigate([`/pages/solicitudeprovider_products/solicitudeprovider/${solicitudeproviders.idsolicitudeprovider}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: SolicitudeprovidersResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<SolicitudeprovidersInterface>(data.result);
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
      const dialogRef = this.dialog.open(SolicitudeprovidersAddModalComponent, {
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
    editModalShow(solicitudeproviders: SolicitudeprovidersInterface) {
      const dialogRef = this.dialog.open(SolicitudeprovidersAddModalComponent, {
              width: '550px',
              data: solicitudeproviders
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
          this.service.remove(item.idsolicitudeprovider)
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
            (data: SolicitudeprovidersResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<SolicitudeprovidersInterface>(data.result);
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
    onUpdate(solicitudeproviders: SolicitudeprovidersInterface): void {
      if (SolicitudeprovidersService) {
          this.service
              .update({
                  idsolicitudeprovider: solicitudeproviders.idsolicitudeprovider,
                  provider_idprovider: solicitudeproviders.provider_idprovider,
                  warehouse_idwarehouse: solicitudeproviders.warehouse_idwarehouse,
                  status: solicitudeproviders.status,
                  validated: solicitudeproviders.validated
              })
              .pipe(take(1))
              .subscribe(
                  (data: any) => {
                    this.showToast(data);
                    this.getAll();
              });
      }
    }
    validateAndClose(solicitudeproviders: SolicitudeprovidersInterface) {
      // Solicitar PIN
      const dialogRef = this.dialog.open(AuthorizeComponent);
      dialogRef.afterClosed().subscribe(nip => {
        if (nip) {
          const user = {
            password: nip,
            module: 'solicitudeprovider'
          };
          this.authService.authorize(user)
          .pipe(take(1)).
          subscribe((data: any) => {
            if (data.success) {
              solicitudeproviders.validated = true;
              solicitudeproviders.status = 'CERRADA';
              this.onUpdate(solicitudeproviders);
            }
          });
        }
      });
    }
    onlyClose(solicitudeproviders: SolicitudeprovidersInterface) {
      solicitudeproviders.status = 'CERRADA';
      this.onUpdate(solicitudeproviders);
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.data.filter = filterValue.trim().toLowerCase();
    }
  }
