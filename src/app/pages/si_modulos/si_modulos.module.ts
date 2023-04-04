import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './si_modulos.routing';
import { Si_modulosComponent } from './si_modulos.component';
import { Si_modulosService } from './components/si_modulos-table/si_modulos.service';
import { Si_modulosTableComponent } from './components/si_modulos-table/si_modulos-table.component';
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
    Si_modulosComponent,
    Si_modulosTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Si_modulosService
  ]
})
export class Si_modulosModule {
}
