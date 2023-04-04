import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './si_user_rols.routing';
import { Si_user_rolsComponent } from './si_user_rols.component';
import { Si_user_rolsService } from './components/si_user_rols-table/si_user_rols.service';
import { Si_user_rolsTableComponent } from './components/si_user_rols-table/si_user_rols-table.component';
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
    Si_user_rolsComponent,
    Si_user_rolsTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Si_user_rolsService
  ]
})
export class Si_user_rolsModule {
}
