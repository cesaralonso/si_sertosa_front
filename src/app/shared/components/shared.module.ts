import { AgmCoreModule } from '@agm/core';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapVisitasComponent } from './map/map.component';
import { ChartbarrasComponent } from './chart-barras/chart-barras.component';


@NgModule({
    declarations: [
        MapVisitasComponent,
        ChartbarrasComponent
    ],
    imports: [
        CommonModule,
        AgmCoreModule
    ],
    exports: [
        MapVisitasComponent,
        ChartbarrasComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: []
})
export class SharedModule {
}
