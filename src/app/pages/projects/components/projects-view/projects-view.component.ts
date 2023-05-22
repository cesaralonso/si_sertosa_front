import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VehiclesInterface } from 'app/pages/vehicles/components/vehicles-table/vehicles.interface';
import { VehiclesService } from 'app/pages/vehicles/components/vehicles-table/vehicles.service';
import { AuthService } from 'app/shared/services/auth.service';
import { take } from 'rxjs/operators';
import { ProjectsInterface } from '../projects-table/projects.interface';
import { ProjectsService } from '../projects-table/projects.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SolicitudewarehousesService } from 'app/pages/solicitudewarehouses/components/solicitudewarehouses-table/solicitudewarehouses.service';
import { SolicitudewarehousesInterface } from 'app/pages/solicitudewarehouses/components/solicitudewarehouses-table/solicitudewarehouses.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Solicitudewarehouse_productsInterface } from 'app/pages/solicitudewarehouse_products/components/solicitudewarehouse_products-table/solicitudewarehouse_products.interface';
import { Solicitudewarehouse_productsService } from 'app/pages/solicitudewarehouse_products/components/solicitudewarehouse_products-table/solicitudewarehouse_products.service';
import { ProductsInterface } from 'app/pages/products/components/products-table/products.interface';
import { ProductsService } from 'app/pages/products/components/products-table/products.service';
import { Solicitudewarehouse_productsAddModalComponent } from 'app/pages/solicitudewarehouse_products/components/solicitudewarehouse_products-table/solicitudewarehouse_products-add-modal/solicitudewarehouse_products-add-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Project_servicesInterface } from 'app/pages/project_services/components/project_services-table/project_services.interface';
import { Project_servicesService } from 'app/pages/project_services/components/project_services-table/project_services.service';
import { ServicesService } from 'app/pages/services/components/services-table/services.service';
import { ServicesInterface } from 'app/pages/services/components/services-table/services.interface';
import { WarehousesInterface } from 'app/pages/warehouses/components/warehouses-table/warehouses.interface';
import { WarehousesService } from 'app/pages/warehouses/components/warehouses-table/warehouses.service';
import { EmployeesInterface } from 'app/pages/employees/components/employees-table/employees.interface';
import { EmployeesService } from 'app/pages/employees/components/employees-table/employees.service';
import { Service_employeesService } from 'app/pages/service_employees/components/service_employees-table/service_employees.service';
import { OrderoutsService } from 'app/pages/orderouts/components/orderouts-table/orderouts.service';

@Component({
  selector: 'projects-view',
  templateUrl: './projects-view.component.html',
  styleUrls: ['./projects-view.component.html']
})
export class ProjectsViewComponent implements OnInit {
  routeParamsSubs: Subscription;
  idproject: number;

  user;

  formVehicle: FormGroup;
  formSolicitudewarehouse_product: FormGroup;

  _vehicle: VehiclesInterface;
  _project: ProjectsInterface;
  _projectHistorial: ProjectsInterface[];
  _product: ProductsInterface[] = [];
  _project_services: Project_servicesInterface[] = [];
  _project_service: Project_servicesInterface = {
    idproject_service: null
  };
  _solicitudewarehouses: SolicitudewarehousesInterface[] = [];
  _solicitudewarehouse: SolicitudewarehousesInterface = {
    warehouse_idwarehouse: null
  };
  _services: ServicesInterface[] = [];
  _service: ServicesInterface = {
    idservice: null
  };
  _warehouses: WarehousesInterface[] = [];
  _employees: EmployeesInterface[] = [];
  _employee: EmployeesInterface = {
    idemployees: null
  };

  solicitudewarehouse_product: Solicitudewarehouse_productsInterface = {};

  projectRewriteable: boolean = false;

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

  displayedColumnsProjectHistorial: string[] = [
    'actions',
    'created_at',
    'name',
    'companyunits_companyunits_idcompanyunits',
    'vehicle_vehicle_idvehicle',
    'status',
  ];
  displayedLabelsProjectHistorial: string[] = [
    '',
    'Fecha',
    'Nombre',
    'Unidad de negocio',
    'Vehículo',
    'Status',
  ];

  data: any;
  dataProjectHistorial: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isNewSolicitudewarehouse = false;
  isNewServiceemployee = false;

  constructor(
    fb: FormBuilder,
    private vehiclesService: VehiclesService,
    private projectsService: ProjectsService,
    private productsService: ProductsService,
    private servicesService: ServicesService,
    private orderoutsService: OrderoutsService,
    private warehousesService: WarehousesService,
    private project_servicesService: Project_servicesService,
    private employeesService: EmployeesService,
    private service_employesService: Service_employeesService,
    private authService: AuthService,
    public dialog: MatDialog,
    private solicitudewarehousesService: SolicitudewarehousesService,
    private solicitudewarehouse_productsService: Solicitudewarehouse_productsService,
    private route: ActivatedRoute,
    private toastrService: ToasterService
     ) {
      this.formVehicle = fb.group({
      'idvehicleAC' : [''],
      'company_idcompanyAC' : [''],
      'modelAC' : [''],
      'typeAC' : [''],
      'kmAC' : [''],
      'tradeAC' : [''],
      'yearAC' : [''],
      });    

      this.formSolicitudewarehouse_product = fb.group({
        'nameAC' : [''],
        'solicitudewarehouse_idsolicitudewarehouseAC' : [''],
        'product_idproductAC' : [''],
        'quantityAC': ['']
      });

      // Buscar permisos del usuario en el módulo
      this.user = this.authService.useJwtHelper();
  
      if (this.user.super) {
          this.projectRewriteable = true;
      } else {
          const userModules = this.authService.getUserModules();
          if (userModules[0]) {
              for (const element in userModules) {
                  if (userModules.hasOwnProperty(element)) {
                      if (userModules[element].path === '/pages/projects') {
                          this.projectRewriteable = userModules[element].writeable;
                      }
                  } 
              }
          }
      }
  }
  ngOnDestroy() {
      this.routeParamsSubs.unsubscribe();
  }
  ngOnInit() {
    this.routeParamsSubs = this.route.params.subscribe(params => {
      if (params['idproject'] !== undefined) {
        this.idproject = +params['idproject'];
        this.refill();
      }
    });
  }
  refill() {
    this.getProject(this.idproject);
    this.getVehicle(this.idproject);
    // traer solicitudes de almacen ligados a la reparación
    this.getProject_service(this.idproject);
    this.getProduct();
    // traer los servicios disponible
    this.getService();
    // traer almacenes
    this.getWarehouse();
  }
  getWarehouse() {
    this.warehousesService.all()
    .pipe(take(1))
    .subscribe(
        (data: any) => {
          if (data.success) {
            this._warehouses = data.result;
          } else {
            this.toastrService.error(data.message);
          }
        });
  }
  getService() {
    this.servicesService.all()
    .pipe(take(1))
    .subscribe(
        (data: any) => {
          if (data.success) {
            this._services = data.result;
          } else {
            this.toastrService.error(data.message);
          }
        });
  }
  getProduct() {
    this.productsService.all()
    .pipe(take(1))
    .subscribe(
        (data: any) => {
          if (data.success) {
            this._product = data.result;
          } else {
            this.toastrService.error(data.message);
          }
        });
  }
  getSolicitudewarehouse(idproject_service: number) {
    this.solicitudewarehousesService.findByIdProject_service(idproject_service)
    .pipe(take(1))
    .subscribe(
        (data: any) => {
          if (data.success) {
            this._solicitudewarehouses = data.result;
          } else {
            this.toastrService.error(data.message);
          }
        });
  }
  getProject_service(idproject: number) {
    this.project_servicesService.findByIdProject(idproject)
    .pipe(take(1))
    .subscribe(
        (data: any) => {
          if (data.success) {
            this._project_services = data.result;
          } else {
            this.toastrService.error(data.message);
          }
        });
  }
  getSolicitudewarehouse_product(idsolicitudewarehouse: number) {
    this.solicitudewarehouse_productsService.findByIdSolicitudewarehouse(idsolicitudewarehouse)
    .pipe(take(1))
    .subscribe(
        (data: any) => {
          if (data.success) {
            this.data = new MatTableDataSource<Solicitudewarehouse_productsInterface>(data.result);
            this.data.paginator = this.paginator;
            this.data.sort = this.sort;
          } else {
            this.toastrService.error(data.message);
          }
        });
  }
  getSolicitudewarehousedByIdProject(idproject: number) {
    this.solicitudewarehousesService.findByIdProject(idproject)
    .pipe(take(1))
    .subscribe(
        (data: any) => {
          if (data.success) {
            this._solicitudewarehouses = data.result;
          } else {
            this.toastrService.error(data.message);
          }
        });
  }
  getProject(idproject: number) {
      this.projectsService.findById(idproject)
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._project = data.result[0];
              // empleados de la misma unidad de negocio del proyecto
              this.getEmployeeByIdCompanyunits(this._project.companyunits_idcompanyunits);
          });
  }
  getEmployeeByIdCompanyunits(idcompanyunits: number) {
    this.employeesService.findByIdCompanyunits(idcompanyunits)
    .pipe(take(1))
    .subscribe(
        (data: any) => {
            this._employees = data.result;
        });
  }
  getVehicle(idproject: number) {
      this.vehiclesService.findByIdProject(idproject)
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._vehicle = data.result[0];
              // historial
              this.getProjectByIdVehicle(this._vehicle.idvehicle);
          });
  }
  getProjectByIdVehicle(idvehicle: number) {
    this.projectsService.findByIdVehicle(idvehicle)
    .pipe(take(1))
    .subscribe(
        (data: any) => {
          this.dataProjectHistorial = new MatTableDataSource<Solicitudewarehouse_productsInterface>(data.result);
          this.dataProjectHistorial.paginator = this.paginator;
          this.dataProjectHistorial.sort = this.sort;
        });
  }
  editModalShowSolicitudewarehouse_product(solicitudewarehouse_product: Solicitudewarehouse_productsInterface) {
    const dialogRef = this.dialog.open(Solicitudewarehouse_productsAddModalComponent, {
            width: '550px',
            data: solicitudewarehouse_product
        });
        dialogRef.afterClosed()
            .pipe(take(1))
            .subscribe(data => {
                if (data) {
                    this.showToast(data);
                    // Recarga refacciones
                    this.getSolicitudewarehouse_product(this.solicitudewarehouse_product.solicitudewarehouse_idsolicitudewarehouse);
                }
            }),
            error => console.log(error),
            () => console.log('Action completed');
  }
  onDeleteConfirmSolicitudewarehouse_product(event, item): void {
    if (window.confirm('¿Estas seguro de querer eliminar este registro?')) {
        this.solicitudewarehouse_productsService.remove(item.idsolicitudewarehouse_product)
        .pipe(take(1))
        .subscribe(
            (data) => {
              this.showToast(data);
              // Recarga refacciones
              this.getSolicitudewarehouse_product(item.solicitudewarehouse_idsolicitudewarehouse);
            },
            error => console.log(error),
            () => console.log('Delete completed')
        );
    } else {
        console.log('item cancelado');
    }
  }
  onInsertSolicitudewarehouse_product(): void {
    // validar si el producto estpa en existencia en ese almacen
    if (this.formSolicitudewarehouse_product.valid) {
      this.solicitudewarehouse_productsService
      .insert({
              solicitudewarehouse_idsolicitudewarehouse: this.solicitudewarehouse_product.solicitudewarehouse_idsolicitudewarehouse,
              product_idproduct: this.solicitudewarehouse_product.product_idproduct,
              quantity: this.solicitudewarehouse_product.quantity
      })
      .pipe(take(1))
      .subscribe(
          (data: any) => {
            this.showToast(data);
            if (data.success) {
              // Recarga refacciones
              // temporalemente... descontar refacción de almacen, se supone se deben validar 
              // pero a su vez hay que resolver como descontar mientras no se validan...
              this.orderoutsService
              .insert({
                      warehouse_idwarehouse: data.result.idwarehouse, // el id del almacen obtenerlo de respuesta anterior
                      product_idproduct: this.solicitudewarehouse_product.product_idproduct,
                      quantity: this.solicitudewarehouse_product.quantity
              })
              .pipe(take(1))
              .subscribe(
                  (data: any) => {
                    if (data.success) {
                      // Recarga refacciones
                      this.getSolicitudewarehouse_product(this.solicitudewarehouse_product.solicitudewarehouse_idsolicitudewarehouse);
                    } 
                  });
            } 
          });
    }
  }
  onInsertProjectservice(): void {
      if (this._project.idproject && this._service.idservice && this._employee.idemployees) {
          this.project_servicesService
          .insert({
                  project_idproject: this._project.idproject,
                  service_idservice: this._service.idservice
          })
          .pipe(take(1))
          .subscribe(
              (data: any) => {
                this.showToast(data);
                if (data.success) {
                  // obtener id id recien creado idproject_service
                  const idproject_service = data.result.insertId;
                  // por cada empleado crear un service_employee
                  this._employee.idemployees.forEach(idemployee => {
                    // filtrar el emploeado para sacar el iduser que le corresponde
                    const iduseremployee = this._employees.filter(o => o.idemployee === idemployee)[0].si_user_idsi_user;
                    this.service_employesService
                    .insert({
                            employee_idemployee: idemployee,
                            project_service_idproject_service: idproject_service,
                            created_by: iduseremployee // enviar created_by para que el empleado pueda leer sus propios registros usando lso permisos
                    })
                    .pipe(take(1))
                    .subscribe(
                        (data: any) => {
                          console.log('service_employesService data', data);
                        });
                  });
                  this.getProject_service(this._project.idproject);
                }
              });
      }
  }
  onInsertSolicitudewarehouse(): void {
    this.solicitudewarehousesService
    .insert({
            project_service_idproject_service: this._project_service.idproject_service,
            warehouse_idwarehouse: this._solicitudewarehouse.warehouse_idwarehouse
    })
    .pipe(take(1))
    .subscribe(
        (data: any) => {
          this.showToast(data);
          this.getSolicitudewarehouse(this._project_service.idproject_service);
        });
  }
  showToast(result) {
    if (result.success) {
      this.toastrService.success(result.message);
    } else {
      this.toastrService.error(result.message);
    }
  }
  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.data.filter = filterValue.trim().toLowerCase();
  }
  applyFilterProjectHistorial(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataProjectHistorial.filter = filterValue.trim().toLowerCase();
  }
}