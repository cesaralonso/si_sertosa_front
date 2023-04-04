import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './si_rols.routing';
import { Si_rolsComponent } from './si_rols.component';
import { Si_rolsService } from './components/si_rols-table/si_rols.service';
import { Si_rolsTableComponent } from './components/si_rols-table/si_rols-table.component';
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
    Si_rolsComponent,
    Si_rolsTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Si_rolsService
  ]
})
export class Si_rolsModule {
}
