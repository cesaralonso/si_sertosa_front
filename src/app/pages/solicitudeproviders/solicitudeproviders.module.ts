import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './solicitudeproviders.routing';
import { SolicitudeprovidersComponent } from './solicitudeproviders.component';
import { SolicitudeprovidersService } from './components/solicitudeproviders-table/solicitudeproviders.service';
import { SolicitudeprovidersTableComponent } from './components/solicitudeproviders-table/solicitudeproviders-table.component';
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
    SolicitudeprovidersComponent,
    SolicitudeprovidersTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    SolicitudeprovidersService
  ]
})
export class SolicitudeprovidersModule {
}
