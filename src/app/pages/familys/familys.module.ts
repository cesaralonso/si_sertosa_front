import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './familys.routing';
import { FamilysComponent } from './familys.component';
import { FamilysService } from './components/familys-table/familys.service';
import { FamilysTableComponent } from './components/familys-table/familys-table.component';
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
    FamilysComponent,
    FamilysTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    FamilysService
  ]
})
export class FamilysModule {
}
