/* import { BootstrapModalModule } from 'ng2-bootstrap-modal'; */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
/* import { DataTableModule } from 'angular2-datatable'; */
import { routing } from './unauthorized.routing';
import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    AppTranslationModule,
    ReactiveFormsModule,
    NgaModule,
    routing,
    /* DataTableModule, */
    /* BootstrapModalModule.forRoot({ container: document.body })  */ 
  ],
  declarations: [
    UnauthorizedComponent
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class UnauthorizedModule {
}
