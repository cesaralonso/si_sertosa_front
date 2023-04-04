import { ChangePasswordService } from './change-password.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { ChangePasswordComponent } from './change-password.component';
import { routing } from './change-password.routing';



@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing
  ],
  declarations: [
    ChangePasswordComponent,
  ],
  providers: [
    ChangePasswordService,
  ]
})
export class ChangePasswordModule {}
