import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { SolicitudewarehousesInterface } from './solicitudewarehouses.interface';
import { SolicitudewarehousesResponseInterface } from './solicitudewarehouses-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SolicitudewarehousesService } from './solicitudewarehouses.service';
import { SolicitudewarehousesAddModalComponent } from './solicitudewarehouses-add-modal/solicitudewarehouses-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Solicitudewarehouse_productsInterface } from './../../../solicitudewarehouse_products/components/solicitudewarehouse_products-table/solicitudewarehouse_products.interface';
import { Solicitudewarehouse_productsAddModalComponent } from './../../../solicitudewarehouse_products/components/solicitudewarehouse_products-table/solicitudewarehouse_products-add-modal/solicitudewarehouse_products-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AuthorizeComponent } from 'app/shared/components/authorize/authorize.component';

@Component({
selector: 'solicitudewarehouses-table',
templateUrl: './solicitudewarehouses-table.html',
styleUrls: ['./solicitudewarehouses-table.scss'],
})
export class SolicitudewarehousesTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'idsolicitudewarehouse',
      'product_product_idproduct',
      'provider_provider_idprovider',
      'quantity',
      'project_service_project_service_idproject_service',
      'warehouse_warehouse_idwarehouse',
      'usuario',
      'status',
      'created_at',
      'validated',
    ];
    displayedLabels: string[] = [
      '',
      'ID',
      'Producto',
      'Proveedor',
      'Cantidad',
      'Reparación',
      'Almacen',
      'Usuario',
      'Status',
      'Fecha',
      'Validada'
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: SolicitudewarehousesService, 
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
            if (userModules[element].path === '/pages/solicitudewarehouses') {
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
        if (params['idwarehouse'] !== undefined) {
          const idwarehouse = +params['idwarehouse'];
          this.findByIdWarehouse(idwarehouse);
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
            (data: SolicitudewarehousesResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<SolicitudewarehousesInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    private findByIdWarehouse(id: number): void {
      this.service
        .findByIdWarehouse(id)
        .pipe(take(1))
        .subscribe(
            (data: SolicitudewarehousesResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<SolicitudewarehousesInterface>(data.result);
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
    insertSolicitudewarehouse_product(solicitudewarehouses: SolicitudewarehousesInterface) {
      const solicitudewarehouse_product: Solicitudewarehouse_productsInterface = {
        solicitudewarehouse_idsolicitudewarehouse: solicitudewarehouses.idsolicitudewarehouse
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
    viewSolicitudewarehouse_product(solicitudewarehouses: SolicitudewarehousesInterface) {
      this.router.navigate([`/pages/solicitudewarehouse_products/solicitudewarehouse/${solicitudewarehouses.idsolicitudewarehouse}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: SolicitudewarehousesResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<SolicitudewarehousesInterface>(data.result);
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
      const dialogRef = this.dialog.open(SolicitudewarehousesAddModalComponent, {
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
    editModalShow(solicitudewarehouses: SolicitudewarehousesInterface) {
      const dialogRef = this.dialog.open(SolicitudewarehousesAddModalComponent, {
              width: '550px',
              data: solicitudewarehouses
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
          this.service.remove(item.idsolicitudewarehouse)
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
            (data: SolicitudewarehousesResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<SolicitudewarehousesInterface>(data.result);
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

    onUpdate(solicitudewarehouses: SolicitudewarehousesInterface): void {
      if (SolicitudewarehousesService) {
          this.service
              .update({
                  idsolicitudewarehouse: solicitudewarehouses.idsolicitudewarehouse,
                  warehouse_idwarehouse: solicitudewarehouses.warehouse_idwarehouse,
                  status: solicitudewarehouses.status,
                  validated: solicitudewarehouses.validated
              })
              .pipe(take(1))
              .subscribe(
                  (data: any) => {
                    this.showToast(data);
                    this.getAll();
              });
      }
    }

    validateAndClose(solicitudewarehouses: SolicitudewarehousesInterface) {
      
      // Solicitar PIN
      const dialogRef = this.dialog.open(AuthorizeComponent);
  
      dialogRef.afterClosed().subscribe(nip => {
        if (nip) {
          
          const user = {
            password: nip,
            module: 'solicitudewarehouse'
          };

          this.authService.authorize(user)
          .pipe(take(1)).
          subscribe((data: any) => {
            if (data.success) {
              solicitudewarehouses.validated = true;
              solicitudewarehouses.status = 'CERRADA';
              this.onUpdate(solicitudewarehouses);
            }
          });
        }
      });
    }

    onlyClose(solicitudewarehouses: SolicitudewarehousesInterface) {
      solicitudewarehouses.status = 'CERRADA';

      this.onUpdate(solicitudewarehouses);
    }
  }
