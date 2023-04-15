import { AgmCoreModule } from '@agm/core';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapVisitasComponent } from './map/map.component';
import { ChartbarrasComponent } from './chart-barras/chart-barras.component';
import { InformationCardsComponent } from './information-cards/information-cards.component';


@NgModule({
    declarations: [
        MapVisitasComponent,
        ChartbarrasComponent,
        InformationCardsComponent
    ],
    imports: [
        CommonModule,
        AgmCoreModule
    ],
    exports: [
        MapVisitasComponent,
        ChartbarrasComponent,
        InformationCardsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: []
})
export class SharedModule {
}
