import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './si_devices.routing';
import { Si_devicesComponent } from './si_devices.component';
import { Si_devicesService } from './components/si_devices-table/si_devices.service';
import { Si_devicesTableComponent } from './components/si_devices-table/si_devices-table.component';
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
    Si_devicesComponent,
    Si_devicesTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Si_devicesService
  ]
})
export class Si_devicesModule {
}
