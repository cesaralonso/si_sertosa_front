import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './orderouts.routing';
import { OrderoutsComponent } from './orderouts.component';
import { OrderoutsService } from './components/orderouts-table/orderouts.service';
import { OrderoutsTableComponent } from './components/orderouts-table/orderouts-table.component';
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
    OrderoutsComponent,
    OrderoutsTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    OrderoutsService
  ]
})
export class OrderoutsModule {
}
