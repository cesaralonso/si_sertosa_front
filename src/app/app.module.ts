import { CompanysAddModalComponent } from './pages/companys/components/companys-table/companys-add-modal/companys-add-modal.component';
import { CompanygroupsAddModalComponent } from './pages/companygroups/components/companygroups-table/companygroups-add-modal/companygroups-add-modal.component';
import { CompanyunitssAddModalComponent } from './pages/companyunitss/components/companyunitss-table/companyunitss-add-modal/companyunitss-add-modal.component';
import { EmployeesAddModalComponent } from './pages/employees/components/employees-table/employees-add-modal/employees-add-modal.component';
import { FamilysAddModalComponent } from './pages/familys/components/familys-table/familys-add-modal/familys-add-modal.component';
import { OrderinsAddModalComponent } from './pages/orderins/components/orderins-table/orderins-add-modal/orderins-add-modal.component';
import { OrderoutsAddModalComponent } from './pages/orderouts/components/orderouts-table/orderouts-add-modal/orderouts-add-modal.component';
import { ProductsAddModalComponent } from './pages/products/components/products-table/products-add-modal/products-add-modal.component';
import { ProjectsAddModalComponent } from './pages/projects/components/projects-table/projects-add-modal/projects-add-modal.component';
import { Project_servicesAddModalComponent } from './pages/project_services/components/project_services-table/project_services-add-modal/project_services-add-modal.component';
import { ProvidersAddModalComponent } from './pages/providers/components/providers-table/providers-add-modal/providers-add-modal.component';
import { ServicesAddModalComponent } from './pages/services/components/services-table/services-add-modal/services-add-modal.component';
import { Service_employeesAddModalComponent } from './pages/service_employees/components/service_employees-table/service_employees-add-modal/service_employees-add-modal.component';
import { Si_alertasAddModalComponent } from './pages/si_alertas/components/si_alertas-table/si_alertas-add-modal/si_alertas-add-modal.component';
import { Si_devicesAddModalComponent } from './pages/si_devices/components/si_devices-table/si_devices-add-modal/si_devices-add-modal.component';
import { Si_logsAddModalComponent } from './pages/si_logs/components/si_logs-table/si_logs-add-modal/si_logs-add-modal.component';
import { Si_modulosAddModalComponent } from './pages/si_modulos/components/si_modulos-table/si_modulos-add-modal/si_modulos-add-modal.component';
import { Si_permisosAddModalComponent } from './pages/si_permisos/components/si_permisos-table/si_permisos-add-modal/si_permisos-add-modal.component';
import { Si_rolsAddModalComponent } from './pages/si_rols/components/si_rols-table/si_rols-add-modal/si_rols-add-modal.component';
import { Si_rol_permisosAddModalComponent } from './pages/si_rol_permisos/components/si_rol_permisos-table/si_rol_permisos-add-modal/si_rol_permisos-add-modal.component';
import { Si_sesionsAddModalComponent } from './pages/si_sesions/components/si_sesions-table/si_sesions-add-modal/si_sesions-add-modal.component';
import { Si_usersAddModalComponent } from './pages/si_users/components/si_users-table/si_users-add-modal/si_users-add-modal.component';
import { Si_user_rolsAddModalComponent } from './pages/si_user_rols/components/si_user_rols-table/si_user_rols-add-modal/si_user_rols-add-modal.component';
import { SolicitudeprovidersAddModalComponent } from './pages/solicitudeproviders/components/solicitudeproviders-table/solicitudeproviders-add-modal/solicitudeproviders-add-modal.component';
import { Solicitudeprovider_productsAddModalComponent } from './pages/solicitudeprovider_products/components/solicitudeprovider_products-table/solicitudeprovider_products-add-modal/solicitudeprovider_products-add-modal.component';
import { SolicitudewarehousesAddModalComponent } from './pages/solicitudewarehouses/components/solicitudewarehouses-table/solicitudewarehouses-add-modal/solicitudewarehouses-add-modal.component';
import { Solicitudewarehouse_productsAddModalComponent } from './pages/solicitudewarehouse_products/components/solicitudewarehouse_products-table/solicitudewarehouse_products-add-modal/solicitudewarehouse_products-add-modal.component';
import { ValidationsAddModalComponent } from './pages/validations/components/validations-table/validations-add-modal/validations-add-modal.component';
import { VehiclesAddModalComponent } from './pages/vehicles/components/vehicles-table/vehicles-add-modal/vehicles-add-modal.component';
import { WarehousesAddModalComponent } from './pages/warehouses/components/warehouses-table/warehouses-add-modal/warehouses-add-modal.component';
import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './shared/services/auth-guard.service';
import { NgModule, ApplicationRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { routing } from './app.routing';
// Configuración
import { Configuration } from './app.constants';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SaLoadingScreenService } from './shared/components/sa-loading-screen/sa-loading-screen.service';
import { SaLoadingScreenComponent } from './shared/components/sa-loading-screen/sa-loading-screen.component';
import { LoadingScreenInterceptor } from './shared/services/loading-screen.interceptors';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PushNotificationService } from './shared/services/push-notifications.service';
import { SocketIOService } from './shared/services/socketio.service';
import { StateService } from './shared/services/state.service';
import { environment } from '../environments/environment';
import { MaterialModule } from './shared/material.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Service_productsAddModalComponent } from './pages/service_products/components/service_products-table/service_products-add-modal/service_products-add-modal.component';


// Application wide providers
const APP_PROVIDERS = [
AppState,
GlobalState,
Configuration,
];

export type StoreType = {
state: InternalStateType,
restoreInputValues: () => void,
disposeOldHosts: () => void,
};

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
bootstrap: [App],
declarations: [
    App,
    CompanysAddModalComponent,
    CompanygroupsAddModalComponent,
    CompanyunitssAddModalComponent,
    EmployeesAddModalComponent,
    FamilysAddModalComponent,
    OrderinsAddModalComponent,
    OrderoutsAddModalComponent,
    ProductsAddModalComponent,
    ProjectsAddModalComponent,
    Project_servicesAddModalComponent,
    ProvidersAddModalComponent,
  
    ServicesAddModalComponent,
    Service_employeesAddModalComponent,
    Si_alertasAddModalComponent,
    Si_devicesAddModalComponent,
    Si_logsAddModalComponent,
    Si_modulosAddModalComponent,
    Si_permisosAddModalComponent,
    Si_rolsAddModalComponent,
    Si_rol_permisosAddModalComponent,
    Si_sesionsAddModalComponent,
    Si_usersAddModalComponent,
    Si_user_rolsAddModalComponent,
    SolicitudeprovidersAddModalComponent,
    Solicitudeprovider_productsAddModalComponent,
    SolicitudewarehousesAddModalComponent,
    Solicitudewarehouse_productsAddModalComponent,
    ValidationsAddModalComponent,
    VehiclesAddModalComponent,
    WarehousesAddModalComponent,
    Service_productsAddModalComponent,
    SaLoadingScreenComponent
],
imports: [ // import Angular's modules
    BrowserModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    PagesModule,
    routing,
    BrowserAnimationsModule, // required animations module
    JwtModule.forRoot({
      config: {
        authScheme: 'JWT',
        tokenGetter: tokenGetter
      }
    }),
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    NgxMaskModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxx'
    }),
    MaterialModule,
    TooltipModule.forRoot()
],
providers: [
    APP_PROVIDERS,
    SaLoadingScreenService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingScreenInterceptor,
      multi: true
    }
],
schemas: [
  CUSTOM_ELEMENTS_SCHEMA
]
})

export class AppModule {

  constructor(public appState: AppState) {
  }
}
