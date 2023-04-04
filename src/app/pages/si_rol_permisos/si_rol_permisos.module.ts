import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './si_rol_permisos.routing';
import { Si_rol_permisosComponent } from './si_rol_permisos.component';
import { Si_rol_permisosService } from './components/si_rol_permisos-table/si_rol_permisos.service';
import { Si_rol_permisosTableComponent } from './components/si_rol_permisos-table/si_rol_permisos-table.component';
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
    Si_rol_permisosComponent,
    Si_rol_permisosTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Si_rol_permisosService
  ]
})
export class Si_rol_permisosModule {
}
