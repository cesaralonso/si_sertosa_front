import { Routes, RouterModule, CanActivate } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from '../shared/services/auth-guard.service';
export const routes: Routes = [
{
    path: 'login',
    loadChildren: () => import('app/pages/login/login.module').then(m => m.LoginModule)
},{
    path: 'login-employee',
    loadChildren: () => import('app/pages/login-employee/login-employee.module').then(m => m.LoginEmployeeModule)
},
{
    path: 'register',
    loadChildren: () => import('app/pages/register/register.module').then(m => m.RegisterModule)
},
{
    path: 'forgot',
    loadChildren: () => import('app/pages/forgot/forgot.module').then(m => m.ForgotModule)
},
{
    path: 'change-password',
    loadChildren: () => import('app/pages/change-password/change-password.module').then(m => m.ChangePasswordModule)
},
{
    path: 'pages',
    component: Pages,
    children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
    { path: 'unauthorized', loadChildren: () => import('./unauthorized/unauthorized.module').then(m => m.UnauthorizedModule)},
    { path: 'companys', loadChildren: () => import('./companys/companys.module').then(m => m.CompanysModule),
        canActivateChild: [AuthGuard] },
    { path: 'companys/companygroup/:idcompanygroup', loadChildren: () => import('./companys/companys.module').then(m => m.CompanysModule),
        canActivateChild: [AuthGuard] },
    { path: 'companygroups', loadChildren: () => import('./companygroups/companygroups.module').then(m => m.CompanygroupsModule),
        canActivateChild: [AuthGuard] },
    { path: 'companyunitss', loadChildren: () => import('./companyunitss/companyunitss.module').then(m => m.CompanyunitssModule),
        canActivateChild: [AuthGuard] },
    { path: 'companyunitss/company/:idcompany', loadChildren: () => import('./companyunitss/companyunitss.module').then(m => m.CompanyunitssModule),
        canActivateChild: [AuthGuard] },
    { path: 'employees', loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule),
        canActivateChild: [AuthGuard] },
    { path: 'employees/companyunits/:idcompanyunits', loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule),
        canActivateChild: [AuthGuard] },
    { path: 'employees/si_user/:idsi_user', loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule),
        canActivateChild: [AuthGuard] },
    { path: 'familys', loadChildren: () => import('./familys/familys.module').then(m => m.FamilysModule),
        canActivateChild: [AuthGuard] },
    { path: 'orderins', loadChildren: () => import('./orderins/orderins.module').then(m => m.OrderinsModule),
        canActivateChild: [AuthGuard] },
    { path: 'orderins/product/:idproduct', loadChildren: () => import('./orderins/orderins.module').then(m => m.OrderinsModule),
        canActivateChild: [AuthGuard] },
    { path: 'orderins/warehouse/:idwarehouse', loadChildren: () => import('./orderins/orderins.module').then(m => m.OrderinsModule),
        canActivateChild: [AuthGuard] },

        { path: 'orderins/warehouse/:idwarehouseForInventary/inventary', loadChildren: () => import('./orderins/orderins.module').then(m => m.OrderinsModule),
        canActivateChild: [AuthGuard] },


    { path: 'orderouts', loadChildren: () => import('./orderouts/orderouts.module').then(m => m.OrderoutsModule),
        canActivateChild: [AuthGuard] },
    { path: 'orderouts/product/:idproduct', loadChildren: () => import('./orderouts/orderouts.module').then(m => m.OrderoutsModule),
        canActivateChild: [AuthGuard] },
    { path: 'orderouts/warehouse/:idwarehouse', loadChildren: () => import('./orderouts/orderouts.module').then(m => m.OrderoutsModule),
        canActivateChild: [AuthGuard] },
    { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
        canActivateChild: [AuthGuard] },
    { path: 'products/family/:idfamily', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
        canActivateChild: [AuthGuard] },
    { path: 'products/provider/:idprovider', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
        canActivateChild: [AuthGuard] },
        

    { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
        canActivateChild: [AuthGuard] },



    { path: 'projects/:idproject', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
        canActivateChild: [AuthGuard] },


    { path: 'projects/companyunits/:idcompanyunits', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
        canActivateChild: [AuthGuard] },
    { path: 'projects/vehicle/:idvehicle', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
        canActivateChild: [AuthGuard] },
    { path: 'project_services', loadChildren: () => import('./project_services/project_services.module').then(m => m.Project_servicesModule),
        canActivateChild: [AuthGuard] },
    { path: 'project_services/project/:idproject', loadChildren: () => import('./project_services/project_services.module').then(m => m.Project_servicesModule),
        canActivateChild: [AuthGuard] },
    { path: 'project_services/service/:idservice', loadChildren: () => import('./project_services/project_services.module').then(m => m.Project_servicesModule),
        canActivateChild: [AuthGuard] },
    { path: 'providers', loadChildren: () => import('./providers/providers.module').then(m => m.ProvidersModule),
        canActivateChild: [AuthGuard] },
    { path: 'services', loadChildren: () => import('./services/services.module').then(m => m.ServicesModule),
        canActivateChild: [AuthGuard] },
    { path: 'service_employees', loadChildren: () => import('./service_employees/service_employees.module').then(m => m.Service_employeesModule),
        canActivateChild: [AuthGuard] },
    { path: 'service_employees/project_service/:idproject_service', loadChildren: () => import('./service_employees/service_employees.module').then(m => m.Service_employeesModule),
        canActivateChild: [AuthGuard] },
    { path: 'service_employees/employee/:idemployee', loadChildren: () => import('./service_employees/service_employees.module').then(m => m.Service_employeesModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_alertas', loadChildren: () => import('./si_alertas/si_alertas.module').then(m => m.Si_alertasModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_alertas/si_user/:idsi_user', loadChildren: () => import('./si_alertas/si_alertas.module').then(m => m.Si_alertasModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_devices', loadChildren: () => import('./si_devices/si_devices.module').then(m => m.Si_devicesModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_devices/si_rol/:idsi_rol', loadChildren: () => import('./si_devices/si_devices.module').then(m => m.Si_devicesModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_devices/si_user/:idsi_user', loadChildren: () => import('./si_devices/si_devices.module').then(m => m.Si_devicesModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_logs', loadChildren: () => import('./si_logs/si_logs.module').then(m => m.Si_logsModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_logs/si_modulo/:idsi_modulo', loadChildren: () => import('./si_logs/si_logs.module').then(m => m.Si_logsModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_logs/si_user/:idsi_user', loadChildren: () => import('./si_logs/si_logs.module').then(m => m.Si_logsModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_modulos', loadChildren: () => import('./si_modulos/si_modulos.module').then(m => m.Si_modulosModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_permisos', loadChildren: () => import('./si_permisos/si_permisos.module').then(m => m.Si_permisosModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_permisos/si_modulo/:idsi_modulo', loadChildren: () => import('./si_permisos/si_permisos.module').then(m => m.Si_permisosModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_permisos/si_rol/:idsi_rol', loadChildren: () => import('./si_permisos/si_permisos.module').then(m => m.Si_permisosModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_rols', loadChildren: () => import('./si_rols/si_rols.module').then(m => m.Si_rolsModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_rol_permisos', loadChildren: () => import('./si_rol_permisos/si_rol_permisos.module').then(m => m.Si_rol_permisosModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_rol_permisos/si_permiso/:idsi_permiso', loadChildren: () => import('./si_rol_permisos/si_rol_permisos.module').then(m => m.Si_rol_permisosModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_rol_permisos/si_rol/:idsi_rol', loadChildren: () => import('./si_rol_permisos/si_rol_permisos.module').then(m => m.Si_rol_permisosModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_sesions', loadChildren: () => import('./si_sesions/si_sesions.module').then(m => m.Si_sesionsModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_sesions/si_user/:idsi_user', loadChildren: () => import('./si_sesions/si_sesions.module').then(m => m.Si_sesionsModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_users', loadChildren: () => import('./si_users/si_users.module').then(m => m.Si_usersModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_users/companyunits/:idcompanyunits', loadChildren: () => import('./si_users/si_users.module').then(m => m.Si_usersModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_users/si_rol/:idsi_rol', loadChildren: () => import('./si_users/si_users.module').then(m => m.Si_usersModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_user_rols', loadChildren: () => import('./si_user_rols/si_user_rols.module').then(m => m.Si_user_rolsModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_user_rols/si_rol/:idsi_rol', loadChildren: () => import('./si_user_rols/si_user_rols.module').then(m => m.Si_user_rolsModule),
        canActivateChild: [AuthGuard] },
    { path: 'si_user_rols/si_user/:idsi_user', loadChildren: () => import('./si_user_rols/si_user_rols.module').then(m => m.Si_user_rolsModule),
        canActivateChild: [AuthGuard] },
    { path: 'solicitudeproviders', loadChildren: () => import('./solicitudeproviders/solicitudeproviders.module').then(m => m.SolicitudeprovidersModule),
        canActivateChild: [AuthGuard] },
    { path: 'solicitudeproviders/project_service/:idproject_service', loadChildren: () => import('./solicitudeproviders/solicitudeproviders.module').then(m => m.SolicitudeprovidersModule),
        canActivateChild: [AuthGuard] },
    { path: 'solicitudeproviders/provider/:idprovider', loadChildren: () => import('./solicitudeproviders/solicitudeproviders.module').then(m => m.SolicitudeprovidersModule),
        canActivateChild: [AuthGuard] },
    { path: 'solicitudeproviders/warehouse/:idwarehouse', loadChildren: () => import('./solicitudeproviders/solicitudeproviders.module').then(m => m.SolicitudeprovidersModule),
        canActivateChild: [AuthGuard] },

    { path: 'solicitudeproviders/warehouse/:idwarehouse/provider/:idprovider', loadChildren: () => import('./solicitudeproviders/solicitudeproviders.module').then(m => m.SolicitudeprovidersModule),
        canActivateChild: [AuthGuard] },

    { path: 'solicitudeprovider_products', loadChildren: () => import('./solicitudeprovider_products/solicitudeprovider_products.module').then(m => m.Solicitudeprovider_productsModule),
        canActivateChild: [AuthGuard] },
    { path: 'solicitudeprovider_products/product/:idproduct', loadChildren: () => import('./solicitudeprovider_products/solicitudeprovider_products.module').then(m => m.Solicitudeprovider_productsModule),
        canActivateChild: [AuthGuard] },
    { path: 'solicitudeprovider_products/solicitudeprovider/:idsolicitudeprovider', loadChildren: () => import('./solicitudeprovider_products/solicitudeprovider_products.module').then(m => m.Solicitudeprovider_productsModule),
        canActivateChild: [AuthGuard] },
    { path: 'solicitudewarehouses', loadChildren: () => import('./solicitudewarehouses/solicitudewarehouses.module').then(m => m.SolicitudewarehousesModule),
        canActivateChild: [AuthGuard] },
    { path: 'solicitudewarehouses/project_service/:idproject_service', loadChildren: () => import('./solicitudewarehouses/solicitudewarehouses.module').then(m => m.SolicitudewarehousesModule),
        canActivateChild: [AuthGuard] },
    { path: 'solicitudewarehouses/warehouse/:idwarehouse', loadChildren: () => import('./solicitudewarehouses/solicitudewarehouses.module').then(m => m.SolicitudewarehousesModule),
        canActivateChild: [AuthGuard] },
    { path: 'solicitudewarehouse_products', loadChildren: () => import('./solicitudewarehouse_products/solicitudewarehouse_products.module').then(m => m.Solicitudewarehouse_productsModule),
        canActivateChild: [AuthGuard] },
    { path: 'solicitudewarehouse_products/product/:idproduct', loadChildren: () => import('./solicitudewarehouse_products/solicitudewarehouse_products.module').then(m => m.Solicitudewarehouse_productsModule),
        canActivateChild: [AuthGuard] },
    { path: 'solicitudewarehouse_products/solicitudewarehouse/:idsolicitudewarehouse', loadChildren: () => import('./solicitudewarehouse_products/solicitudewarehouse_products.module').then(m => m.Solicitudewarehouse_productsModule),
        canActivateChild: [AuthGuard] },
    { path: 'validations', loadChildren: () => import('./validations/validations.module').then(m => m.ValidationsModule),
        canActivateChild: [AuthGuard] },
    { path: 'validations/service_employee/:idservice_employee', loadChildren: () => import('./validations/validations.module').then(m => m.ValidationsModule),
        canActivateChild: [AuthGuard] },
    { path: 'validations/service/:idservice', loadChildren: () => import('./validations/validations.module').then(m => m.ValidationsModule),
        canActivateChild: [AuthGuard] },
    { path: 'vehicles', loadChildren: () => import('./vehicles/vehicles.module').then(m => m.VehiclesModule),
        canActivateChild: [AuthGuard] },
    { path: 'vehicles/company/:idcompany', loadChildren: () => import('./vehicles/vehicles.module').then(m => m.VehiclesModule),
        canActivateChild: [AuthGuard] },
    { path: 'warehouses', loadChildren: () => import('./warehouses/warehouses.module').then(m => m.WarehousesModule),
        canActivateChild: [AuthGuard] },
    { path: 'warehouses/company/:idcompany', loadChildren: () => import('./warehouses/warehouses.module').then(m => m.WarehousesModule),
        canActivateChild: [AuthGuard] },

    { path: 'service_employeeestados/service_employee/:idservice_employee', loadChildren: () => import('./service_employeeestados/service_employeeestados.module').then(m => m.Service_employeeestadosModule),
    canActivateChild: [AuthGuard] },

    { path: 'warehouses/:idwarehouse/inventary', loadChildren: () => import('./warehouses/warehouses.module').then(m => m.WarehousesModule),
        canActivateChild: [AuthGuard] },


    { path: 'service_products', loadChildren: () => import('./service_products/service_products.module').then(m => m.Service_productsModule),
        canActivateChild: [AuthGuard] },
    { path: 'service_products/product/:idproduct', loadChildren: () => import('./service_products/service_products.module').then(m => m.Service_productsModule),
        canActivateChild: [AuthGuard] },
    { path: 'service_products/service/:idservice', loadChildren: () => import('./service_products/service_products.module').then(m => m.Service_productsModule),
        canActivateChild: [AuthGuard] },

    { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
        canActivateChild: [AuthGuard] }
    ]
}
];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);
