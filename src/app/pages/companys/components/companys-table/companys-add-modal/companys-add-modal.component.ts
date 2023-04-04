import { AuthService } from './../../../../../shared/services/auth.service';
import { CompanysService } from './../companys.service';
import { CompanysInterface } from './../companys.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from './../../../../../shared/services/toaster.service';
import { take } from 'rxjs/operators';
/* import { HttpEventType, HttpEvent } from '@angular/common/http'; */
/* import { Message, Type } from './../../../../../shared/models'; */
/* import { SocketIOService } from './../../../../../shared/services/socketio.service'; */
import { CompanygroupsService } from './../../../../companygroups/components/companygroups-table/companygroups.service';
import { CompanygroupsAddModalComponent } from './../../../../companygroups/components/companygroups-table/companygroups-add-modal/companygroups-add-modal.component';
import { CompanygroupsInterface } from './../../../../companygroups/components/companygroups-table/companygroups.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./companys-add-modal.component.scss')],
  templateUrl: './companys-add-modal.component.html'
})
export class CompanysAddModalComponent implements OnInit {
  _companygroup: CompanygroupsInterface[] = [];
  companygroupRewriteable: boolean = false;

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
    private service: CompanysService,
    private authService: AuthService, 
    /* private socketIOService: SocketIOService, */
    private companygroupsService: CompanygroupsService,
    fb: FormBuilder,
    private toastrService: ToasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CompanysAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: CompanysInterface
  ) {
    this.form = fb.group({
    'nameAC' : ['', this.item.name ? Validators.compose([ Validators.required, Validators.maxLength(45)]) : null],
    'companygroup_idcompanygroupAC' : ['', this.item.companygroup_idcompanygroup ? Validators.compose([ Validators.required, Validators.maxLength(10)]) : null],
    'logoAC' : ['', this.item.logo ? Validators.compose([ Validators.maxLength(300)]) : null],
    });
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();

    if (this.user.super) {
        this.companygroupRewriteable = true;
    } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
            for (const element in userModules) {
                if (userModules.hasOwnProperty(element)) {
                    if (userModules[element].path === '/pages/companygroups') {
                        this.companygroupRewriteable = userModules[element].writeable;
                    }
                } 
            }
        }
    }
  }
  ngOnInit() {
      this.getCompanygroup();
      // Revisa si es agregar o editar
      if (this.item.idcompany) {
          this.accion = "Editar";
      } else {
          this.accion = "Agregar";
      }
  }
  companygroupAddModalShow() {
      const dialogRef = this.dialog.open(CompanygroupsAddModalComponent, {
              width: '550px',
              data: {},
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.companygroupShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
  }
  companygroupShowToast(result) {
      if (result.success) {
          this.toastrService.success(result.message);
          this.getCompanygroup(result.result.insertId);
      } else {
          this.toastrService.error(result.message);
      }
  }
  getCompanygroup(idcompanygroup?: number) {
      this.companygroupsService.all()
      .pipe(take(1))
      .subscribe(
          (data: any) => {
              this._companygroup = data.result;
              if (idcompanygroup) {
                  this.form.patchValue({
                      companygroup_idcompanygroupAC: idcompanygroup
                  });
              }
          });
  }
  confirm() {
      this.dialogRef.close(this.data);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.item.idcompany) {
        this.onUpdate();
    } else {
        this.onInsert();
    }
}

  // IMÁGENES
  onInsert(): void {
            
      // SI HAY FOTO CAPTURADA LA REDIMENSIONA
      if (this.preview) {
          this.form.patchValue({
              logoAC: this.dataURItoBlob(this.resizeImage(this.preview))
          });
          this.form.get('logoAC').updateValueAndValidity();
      }

    if (this.form.valid) {
        this.service
        .insertFile({
                name: this.item.name || null,
                companygroup_idcompanygroup: this.item.companygroup_idcompanygroup || null,
        }, this.form.value.logoAC)
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
onUpdate(): void {
    if (this.form.valid) {
        this.service
            .updateFile({
                idcompany: this.item.idcompany,
                name: this.item.name,
                companygroup_idcompanygroup: this.item.companygroup_idcompanygroup,
            }, this.form.value.logoAC)
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
              logoAC: file
          });
          this.form.get('logoAC').updateValueAndValidity();
          // File Preview
          const reader = new FileReader();
          reader.onload = () => {
              this.preview = reader.result as string;
          }
          reader.readAsDataURL(file);
      } else {
          this.form.patchValue({
              logoAC: ''
          });
          this.form.get('logoAC').updateValueAndValidity();
          this.preview = '';
      }
  }
  resizeImage(dataURI: string): string {
      var img = document.createElement("img");
      img.src = dataURI;

      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      var MAX_WIDTH = 800;
      var MAX_HEIGHT = 800;
      var width = img.width;
      var height = img.height;

      if (width > height) {
          if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
          }
      } else {
          if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
          }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var dataurl = canvas.toDataURL(mimeString, 0.7); // COMPRESIÓN

      return dataurl;
  }
  dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], {type: mimeString});
  }


}
