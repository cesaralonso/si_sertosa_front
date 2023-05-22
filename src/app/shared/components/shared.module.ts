import { AgmCoreModule } from '@agm/core';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapVisitasComponent } from './map/map.component';
import { ChartbarrasComponent } from './chart-barras/chart-barras.component';
import { AuthorizeComponent } from './authorize/authorize.component';
import { MaterialModule } from '../material.module';


@NgModule({
    declarations: [
        MapVisitasComponent,
        ChartbarrasComponent,
        AuthorizeComponent
    ],
    imports: [
        CommonModule,
        AgmCoreModule,
        MaterialModule
    ],
    exports: [
        MapVisitasComponent,
        ChartbarrasComponent,
        AuthorizeComponent,
        MaterialModule
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: []
})
export class SharedModule {
}
