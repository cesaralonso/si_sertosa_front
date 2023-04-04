import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { CompanysInterface } from './companys.interface';
import { CompanysResponseInterface } from './companys-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanysService } from './companys.service';
import { CompanysAddModalComponent } from './companys-add-modal/companys-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CompanyunitssInterface } from './../../../companyunitss/components/companyunitss-table/companyunitss.interface';
import { CompanyunitssAddModalComponent } from './../../../companyunitss/components/companyunitss-table/companyunitss-add-modal/companyunitss-add-modal.component';
import { VehiclesInterface } from './../../../vehicles/components/vehicles-table/vehicles.interface';
import { VehiclesAddModalComponent } from './../../../vehicles/components/vehicles-table/vehicles-add-modal/vehicles-add-modal.component';
import { WarehousesInterface } from './../../../warehouses/components/warehouses-table/warehouses.interface';
import { WarehousesAddModalComponent } from './../../../warehouses/components/warehouses-table/warehouses-add-modal/warehouses-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'companys-table',
templateUrl: './companys-table.html',
styleUrls: ['./companys-table.scss'],
})
export class CompanysTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'name',
      'companygroup_companygroup_idcompanygroup',
      'logo',
    ];
    displayedLabels: string[] = [
      '',
      'Nombre',
      'Grupo',
      'Logotipo',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: CompanysService, 
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
            if (userModules[element].path === '/pages/companys') {
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
        if (params['idcompanygroup'] !== undefined) {
          const idcompanygroup = +params['idcompanygroup'];
          this.findByIdCompanygroup(idcompanygroup);
          this.backpage = true;
        }
        if (!this.backpage) {
          this.getAll();
        }
      });
    }
    private findByIdCompanygroup(id: number): void {
      this.service
        .findByIdCompanygroup(id)
        .pipe(take(1))
        .subscribe(
            (data: CompanysResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<CompanysInterface>(data.result);
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
    insertCompanyunits(companys: CompanysInterface) {
      const companyunits: CompanyunitssInterface = {
        company_idcompany: companys.idcompany
      }
      const dialogRef = this.dialog.open(CompanyunitssAddModalComponent, {
              width: '550px',
              data: companyunits,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.companyunitsShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    companyunitsShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewCompanyunits(companys: CompanysInterface) {
      this.router.navigate([`/pages/companyunitss/company/${companys.idcompany}`]);
    }
    insertVehicle(companys: CompanysInterface) {
      const vehicle: VehiclesInterface = {
        company_idcompany: companys.idcompany
      }
      const dialogRef = this.dialog.open(VehiclesAddModalComponent, {
              width: '550px',
              data: vehicle,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.vehicleShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    vehicleShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewVehicle(companys: CompanysInterface) {
      this.router.navigate([`/pages/vehicles/company/${companys.idcompany}`]);
    }
    insertWarehouse(companys: CompanysInterface) {
      const warehouse: WarehousesInterface = {
        company_idcompany: companys.idcompany
      }
      const dialogRef = this.dialog.open(WarehousesAddModalComponent, {
              width: '550px',
              data: warehouse,
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
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewWarehouse(companys: CompanysInterface) {
      this.router.navigate([`/pages/warehouses/company/${companys.idcompany}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: CompanysResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<CompanysInterface>(data.result);
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
      const dialogRef = this.dialog.open(CompanysAddModalComponent, {
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
    editModalShow(companys: CompanysInterface) {
      const dialogRef = this.dialog.open(CompanysAddModalComponent, {
              width: '550px',
              data: companys
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
          this.service.remove(item.idcompany)
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
            (data: CompanysResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<CompanysInterface>(data.result);
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
