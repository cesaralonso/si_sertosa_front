import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './project_services.routing';
import { Project_servicesComponent } from './project_services.component';
import { Project_servicesService } from './components/project_services-table/project_services.service';
import { Project_servicesTableComponent } from './components/project_services-table/project_services-table.component';
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
    Project_servicesComponent,
    Project_servicesTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Project_servicesService
  ]
})
export class Project_servicesModule {
}
