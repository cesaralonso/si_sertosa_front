import { AgmCoreModule } from '@agm/core';
import { TrackingMapComponent } from './components/map/map.component';
/* import { BootstrapModalModule } from 'ng2-bootstrap-modal'; */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './tracking.routing';
import { TrackingComponent } from './tracking.component';

@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    NgaModule,
    routing,
    /* BootstrapModalModule.forRoot({ container: document.body }), */
    AgmCoreModule
  ],
  declarations: [
    TrackingComponent,
    TrackingMapComponent
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class TrackingModule {
}
