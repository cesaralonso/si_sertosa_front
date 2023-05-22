import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  code: number;
}

@Component({
  selector: 'authorize-component',
  templateUrl: 'authorize.component.html'
})
export class AuthorizeComponent {
  constructor(
    public dialogRef: MatDialogRef<AuthorizeComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}