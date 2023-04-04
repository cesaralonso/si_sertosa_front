import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './services.routing';
import { ServicesComponent } from './services.component';
import { ServicesService } from './components/services-table/services.service';
import { ServicesTableComponent } from './components/services-table/services-table.component';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    AppTranslationModule,
    ReactiveFormsModule,
    NgaModule,
    routing,
    MaterialModule,
  ],
  declarations: [
    ServicesComponent,
    ServicesTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    ServicesService
  ]
})
export class ServicesModule {
}
