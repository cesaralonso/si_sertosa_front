import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './projects.routing';
import { ProjectsComponent } from './projects.component';
import { ProjectsService } from './components/projects-table/projects.service';
import { ProjectsTableComponent } from './components/projects-table/projects-table.component';
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
    ProjectsComponent,
    ProjectsTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    ProjectsService
  ]
})
export class ProjectsModule {
}
