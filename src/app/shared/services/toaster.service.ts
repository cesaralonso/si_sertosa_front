import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({ 
    providedIn: 'root' 
})
export class ToasterService {

    GRAL_ACTION = "Aceptar";

    constructor(private _snackBar: MatSnackBar) {}

    success(message: string, action?: string) {
        action = (action) ? action : this.GRAL_ACTION;
        this._snackBar.open(message, action, {
            duration: 4000,
            panelClass: ['green-snackbar']
          });
    }

    error(message: string, action?: string) {
        action = (action) ? action : this.GRAL_ACTION;
        this._snackBar.open(message, action, {
            duration: 4000,
            panelClass: ['red-snackbar']
          });
    }

    warning(message: string, action?: string) {
        action = (action) ? action : this.GRAL_ACTION;
        this._snackBar.open(message, action, {
            duration: 4000,
            panelClass: ['orange-snackbar']
          });
    }

    info(message: string, action?: string) {
        action = (action) ? action : this.GRAL_ACTION;
        this._snackBar.open(message, action, {
            duration: 4000,
            panelClass: ['blue-snackbar']
          });
    }
}
