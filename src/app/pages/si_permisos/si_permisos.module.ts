import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './si_permisos.routing';
import { Si_permisosComponent } from './si_permisos.component';
import { Si_permisosService } from './components/si_permisos-table/si_permisos.service';
import { Si_permisosTableComponent } from './components/si_permisos-table/si_permisos-table.component';
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
    Si_permisosComponent,
    Si_permisosTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Si_permisosService
  ]
})
export class Si_permisosModule {
}
