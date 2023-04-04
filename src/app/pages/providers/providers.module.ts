import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './providers.routing';
import { ProvidersComponent } from './providers.component';
import { ProvidersService } from './components/providers-table/providers.service';
import { ProvidersTableComponent } from './components/providers-table/providers-table.component';
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
    ProvidersComponent,
    ProvidersTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    ProvidersService
  ]
})
export class ProvidersModule {
}
