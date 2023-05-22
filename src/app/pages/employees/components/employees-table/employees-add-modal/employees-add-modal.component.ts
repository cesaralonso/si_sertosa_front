import { AuthService } from './../../../../../shared/services/auth.service';
import { EmployeesService } from './../employees.service';
import { EmployeesInterface } from './../employees.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { Si_usersService } from './../../../../si_users/components/si_users-table/si_users.service';
import { Si_usersAddModalComponent } from './../../../../si_users/components/si_users-table/si_users-add-modal/si_users-add-modal.component';
import { Si_usersInterface } from './../../../../si_users/components/si_users-table/si_users.interface';
import { CompanyunitssService } from './../../../../companyunitss/components/companyunitss-table/companyunitss.service';
import { CompanyunitssAddModalComponent } from './../../../../companyunitss/components/companyunitss-table/companyunitss-add-modal/companyunitss-add-modal.component';
import { CompanyunitssInterface } from './../../../../companyunitss/components/companyunitss-table/companyunitss.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

// IMAGENES
import { HttpEventType, HttpEvent } from '@angular/common/http';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./employees-add-modal.component.scss')],
  templateUrl: './employees-add-modal.component.html'
})
export class EmployeesAddModalComponent implements OnInit {
  _si_user: Si_usersInterface[] = [];
  _companyunits: CompanyunitssInterface[] = [];
  si_userRewriteable: boolean = false;
  companyunitsRewriteable: boolean = false;

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  // IMAGENES
  preview: string;
  percentDone: any = 0;
  isPermited = false;

  constructor(
    private service: EmployeesService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private si_usersService: Si_usersService,
    private companyunitssService: CompanyunitssService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EmployeesAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: EmployeesInterface
  ) {
    this.form = fb.group({
    'nameAC' : ['', this.item.name ? Validators.compose([ Validators.required, Validators.maxLength(145)]) : null],
    'phoneAC' : ['', this.item.phone ? Validators.compose([ Validators.required, Validators.maxLength(85)]) : null],
    'si_user_idsi_userAC' : ['', this.item.si_user_idsi_user ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'companyunits_idcompanyunitsAC' : ['', this.item.companyunits_idcompanyunits ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'codeAC' : ['', this.item.code ? Validators.compose([ Validators.maxLength(45)]) : null],
    'photoAC' : ['', this.item.photo ? Validators.compose([ Validators.maxLength(300)]) : null],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.si_userRewriteable = true;
        this.companyunitsRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/si_users') {
                        this.si_userRewriteable = userModules[element].writeable;
                    }
                    if (userModules[element].path === '/pages/companyunitss') {
                        this.companyunitsRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getSi_user();
      this.getCompanyunits();
      // Revisa si es agregar o editar
      if (this.item.idemployee) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
      }
  }
  si_userAddModalShow() {
      const dialogRef = this.dialog.open(Si_usersAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.si_userShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  si_userShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getSi_user(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
  }
  companyunitsAddModalShow() {
      const dialogRef = this.dialog.open(CompanyunitssAddModalComponent, {
              width: '550px',
              data: {},
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
          this.getCompanyunits(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
  }
  getSi_user(idsi_user?: number) {
      this.si_usersService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._si_user = data.result;
              if (idsi_user) {
                  this.form.patchValue({
                      si_user_idsi_userAC: idsi_user
                  });
              }
          });
  }
  getCompanyunits(idcompanyunits?: number) {
      this.companyunitssService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._companyunits = data.result;
              if (idcompanyunits) {
                  this.form.patchValue({
                      companyunits_idcompanyunitsAC: idcompanyunits
                  });
              }
          });
  }
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idemployee) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {            
      if (this.form.valid) {
          this.service
          .insertFile({
                  name: this.item.name || null,
                  phone: this.item.phone || null,
                  si_user_idsi_user: this.item.si_user_idsi_user || null,
                  companyunits_idcompanyunits: this.item.companyunits_idcompanyunits || null,
                  code: this.item.code || null,
          }, this.form.value.photoAC)
          .subscribe((event: HttpEvent<any>) => {
            switch (event.type) {
                case HttpEventType.Sent:
                    console.log('Request has been made!');
                break;
                case HttpEventType.ResponseHeader:
                    console.log('Response header has been received!');
                break;
                case HttpEventType.UploadProgress:
                    this.percentDone = Math.round(event.loaded / event.total * 100);
                    console.log(`Uploaded! %`);
                break;
                case HttpEventType.Response:
                    console.log('Successfully created!', event.body);
                    this.percentDone = false;
                    this.data = event.body;
                    
                    this.confirm();
            }
        });
         
      } 
  }
  filterUser() {
    // filtra usuario seleccionado para asignar nombre completo y unidad de negocio
    const userSelected = this._si_user.filter(o => o.idsi_user === this.item.si_user_idsi_user)[0];
    this.item.name = userSelected.nombre + ' ' + userSelected.apmat + ' ' + userSelected.apmat; 
    this.item.companyunits_idcompanyunits = userSelected.companyunits_idcompanyunits; 
  }
  onUpdate(): void {            
      if (this.form.valid) {
          this.service
              .updateFile({
                  idemployee: this.item.idemployee,
                  name: this.item.name,
                  phone: this.item.phone,
                  si_user_idsi_user: this.item.si_user_idsi_user,
                  companyunits_idcompanyunits: this.item.companyunits_idcompanyunits,
                  code: this.item.code,
              }, this.form.value.photoAC)
              .subscribe((event: HttpEvent<any>) => {
                    switch (event.type) {
                        case HttpEventType.Sent:
                            console.log('Request has been made!');
                        break;
                        case HttpEventType.ResponseHeader:
                            console.log('Response header has been received!');
                        break;
                        case HttpEventType.UploadProgress:
                            this.percentDone = Math.round(event.loaded / event.total * 100);
                            console.log(`Uploaded! %`);
                        break;
                        case HttpEventType.Response:
                            console.log('Successfully created!', event.body);
                            this.percentDone = false;
                            this.data = event.body;
                            
                            this.confirm();
                    }
                });

      }
    }
    // Image Preview
    uploadFile(event) {
        var fileTypes = ['png', 'jpg', 'jpeg'];  //acceptable file types
        const file = (event.target as HTMLInputElement).files[0];
        const extension = file.name.split('.').pop().toLowerCase();  //file extension from input file
        this.isPermited = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types
        if (this.isPermited) {
            this.form.patchValue({
                photoAC: file
            });
            this.form.get('photoAC').updateValueAndValidity();
            // File Preview
            const reader = new FileReader();
            reader.onload = () => {
                this.preview = reader.result as string;
            }
            reader.readAsDataURL(file);
        } else {
            this.form.patchValue({
                photoAC: ''
            });
            this.form.get('photoAC').updateValueAndValidity();
            this.preview = '';
        }
    }
}
