import { AuthService } from './../../../../../shared/services/auth.service';
import { ProvidersService } from './../providers.service';
import { ProvidersInterface } from './../providers.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./providers-add-modal.component.scss')],
  templateUrl: './providers-add-modal.component.html'
})
export class ProvidersAddModalComponent implements OnInit {

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: ProvidersService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProvidersAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: ProvidersInterface
  ) {
    this.form = fb.group({
        'nameAC' : ['', this.item.name ? Validators.compose([ Validators.required, Validators.maxLength(45)]) : null],
        'aliasAC' : ['', this.item.status ? Validators.compose([ Validators.maxLength(45)]) : null],
        'rfcAC' : ['', this.item.status ? Validators.compose([ Validators.required, Validators.maxLength(13)]) : null],
        'billing_emailAC' : ['', this.item.status ? Validators.compose([ Validators.maxLength(100)]) : null],
        'office_phoneAC' : ['', this.item.status ? Validators.compose([ Validators.maxLength(30)]) : null],
        'care_contactAC' : ['', this.item.status ? Validators.compose([ Validators.maxLength(45)]) : null],
        'care_emailAC' : ['', this.item.status ? Validators.compose([ Validators.maxLength(100)]) : null],
        'care_phoneAC' : ['', this.item.status ? Validators.compose([ Validators.maxLength(30)]) : null],
        /* 'skusAC' : ['', this.item.status ? Validators.compose([ Validators.maxLength(45)]) : null], */
        'statusAC' : ['', this.item.status ? Validators.compose([ Validators.maxLength(45)]) : null],
        'logoAC' : ['', this.item.logo ? Validators.compose([ Validators.maxLength(300)]) : null]
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                } 
            }
        }
    }
  }
  ngOnInit() {
      // Revisa si es agregar o editar
      if (this.item.idprovider) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
      }
  }
  confirm() {
      this.dialogRef.close(this.data);
  }
  onSubmit(): void {
      this.submitted = true;
      if (this.item.idprovider) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
            name: this.item.name,
            alias: this.item.alias,
            rfc: this.item.rfc,
            billing_email: this.item.billing_email,
            office_phone: this.item.office_phone,
            care_contact: this.item.care_contact,
            care_email: this.item.care_email,
            care_phone: this.item.care_phone,
            /* skus: this.item.skus, */
            status: this.item.status
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
                  idprovider: this.item.idprovider,
                  name: this.item.name || null,
                  alias: this.item.alias,
                  rfc: this.item.rfc,
                  billing_email: this.item.billing_email,
                  office_phone: this.item.office_phone,
                  care_contact: this.item.care_contact,
                  care_email: this.item.care_email,
                  care_phone: this.item.care_phone,
                  /* skus: this.item.skus, */
                  status: this.item.status,
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
