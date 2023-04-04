import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './orderins.routing';
import { OrderinsComponent } from './orderins.component';
import { OrderinsService } from './components/orderins-table/orderins.service';
import { OrderinsTableComponent } from './components/orderins-table/orderins-table.component';
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
    OrderinsComponent,
    OrderinsTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    OrderinsService
  ]
})
export class OrderinsModule {
}
