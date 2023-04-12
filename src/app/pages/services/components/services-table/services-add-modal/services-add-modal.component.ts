import { AuthService } from '../../../../../shared/services/auth.service';
import { ServicesService } from '../services.service';
import { ServicesInterface } from '../services.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from '../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./services-add-modal.component.scss')],
  templateUrl: './services-add-modal.component.html'
})
export class ServicesAddModalComponent implements OnInit {

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: ServicesService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ServicesAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: ServicesInterface
  ) {
    this.form = fb.group({
    'nameAC' : ['', this.item.name ? Validators.compose([ Validators.required, Validators.maxLength(145)]) : null],
    'initialMessageAC' : [''],
    /* 'finalMessageAC' : [''],
    'emailMessageAC' : [''],
    'downloableAC' : [''],
    'showEmployeeAC' : [''],
    'targetAC' : [''],
    'timeAC' : ['', this.item.time ? Validators.compose([ Validators.maxLength(11)]) : null],*/
    /* 'saveAsTemplateAC' : [''] */
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
      if (this.item.idservice) {
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
      if (this.item.idservice) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  name: this.item.name || null,
                  initialMessage: this.item.initialMessage || null,
                  /* finalMessage: this.item.finalMessage || null,
                  emailMessage: this.item.emailMessage || null,
                  downloable: this.item.downloable || null,
                  showEmployee: this.item.showEmployee || null,
                  target: this.item.target || null,
                  time: this.item.time || null, */
                  /* saveAsTemplate: this.item.saveAsTemplate || null */
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
                  idservice: this.item.idservice,
                  name: this.item.name,
                  initialMessage: this.item.initialMessage,
                  /* finalMessage: this.item.finalMessage,
                  emailMessage: this.item.emailMessage,
                  downloable: this.item.downloable,
                  showEmployee: this.item.showEmployee,
                  target: this.item.target,
                  time: this.item.time, */
                 /*  saveAsTemplate: this.item.saveAsTemplate */
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
