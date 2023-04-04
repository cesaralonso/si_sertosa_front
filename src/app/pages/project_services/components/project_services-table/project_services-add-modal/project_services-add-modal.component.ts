import { AuthService } from './../../../../../shared/services/auth.service';
import { Project_servicesService } from './../project_services.service';
import { Project_servicesInterface } from './../project_services.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { ProjectsService } from './../../../../projects/components/projects-table/projects.service';
import { ProjectsAddModalComponent } from './../../../../projects/components/projects-table/projects-add-modal/projects-add-modal.component';
import { ProjectsInterface } from './../../../../projects/components/projects-table/projects.interface';
import { ServicesService } from './../../../../services/components/services-table/services.service';
import { ServicesAddModalComponent } from './../../../../services/components/services-table/services-add-modal/services-add-modal.component';
import { ServicesInterface } from './../../../../services/components/services-table/services.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./project_services-add-modal.component.scss')],
  templateUrl: './project_services-add-modal.component.html'
})
export class Project_servicesAddModalComponent implements OnInit {
  _project: ProjectsInterface[] = [];
  _service: ServicesInterface[] = [];
  projectRewriteable: boolean = false;
  serviceRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: Project_servicesService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private projectsService: ProjectsService,
    private servicesService: ServicesService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Project_servicesAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Project_servicesInterface
  ) {
    this.form = fb.group({
    'project_idprojectAC' : ['', this.item.project_idproject ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'service_idserviceAC' : ['', this.item.service_idservice ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.projectRewriteable = true;
        this.serviceRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/projects') {
                        this.projectRewriteable = userModules[element].writeable;
                    }
                    if (userModules[element].path === '/pages/services') {
                        this.serviceRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getProject();
      this.getService();
      // Revisa si es agregar o editar
      if (this.item.idproject_service) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
      }
  }
  projectAddModalShow() {
      const dialogRef = this.dialog.open(ProjectsAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.projectShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  projectShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getProject(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
  }
  serviceAddModalShow() {
      const dialogRef = this.dialog.open(ServicesAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.serviceShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  serviceShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getService(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
  }
  getProject(idproject?: number) {
      this.projectsService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._project = data.result;
              if (idproject) {
                  this.form.patchValue({
                      project_idprojectAC: idproject
                  });
              }
          });
  }
  getService(idservice?: number) {
      this.servicesService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._service = data.result;
              if (idservice) {
                  this.form.patchValue({
                      service_idserviceAC: idservice
                  });
              }
          });
  }
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idproject_service) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  project_idproject: this.item.project_idproject || null,
                  service_idservice: this.item.service_idservice || null,
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
                  idproject_service: this.item.idproject_service,
                  project_idproject: this.item.project_idproject,
                  service_idservice: this.item.service_idservice,
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
