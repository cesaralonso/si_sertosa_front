import { AuthService } from './../../../../../shared/services/auth.service';
import { Si_modulosService } from './../si_modulos.service';
import { Si_modulosInterface } from './../si_modulos.interface';
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
  styleUrls: [('./si_modulos-add-modal.component.scss')],
  templateUrl: './si_modulos-add-modal.component.html'
})
export class Si_modulosAddModalComponent implements OnInit {

  modalHeader: string;
  data: any;
  form: FormGroup;
  submitted: boolean = false;
  user;
  accion = 'Agregar';

  constructor(
    private service: Si_modulosService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Si_modulosAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Si_modulosInterface
  ) {
    this.form = fb.group({
    'codigoAC' : ['', this.item.codigo ? Validators.compose([ Validators.required, Validators.maxLength(55)]) : null],
    'nombreAC' : ['', this.item.nombre ? Validators.compose([ Validators.required, Validators.maxLength(25)]) : null],
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
      if (this.item.idsi_modulo) {
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
      if (this.item.idsi_modulo) {
          this.onUpdate();
      } else {
          this.onInsert();
      }
  }
  onInsert(): void {
      if (this.form.valid) {
          this.service
          .insert({
                  codigo: this.item.codigo || null,
                  nombre: this.item.nombre || null,
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
                  idsi_modulo: this.item.idsi_modulo,
                  codigo: this.item.codigo,
                  nombre: this.item.nombre,
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
