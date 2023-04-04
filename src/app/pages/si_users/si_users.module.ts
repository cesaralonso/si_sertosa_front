import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './si_users.routing';
import { Si_usersComponent } from './si_users.component';
import { Si_usersService } from './components/si_users-table/si_users.service';
import { Si_usersTableComponent } from './components/si_users-table/si_users-table.component';
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
    Si_usersComponent,
    Si_usersTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Si_usersService
  ]
})
export class Si_usersModule {
}
