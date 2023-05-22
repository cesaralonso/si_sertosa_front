export const PAGES_MENU = [
{
    path: 'pages',
    children: [    
        
        {
            path: 'dashboard',
            data: {
            menu: {
                title: 'general.menu.dashboard',
                icon: 'ion-android-home',
                selected: false,
                expanded: false,
                order: 0
            }
            }
        },
        {
            path: 'projects',
            data: {
            menu: {
                title: 'general.menu.projects',
                icon: 'ion-star',
                selected: false,
                expanded: false,
                order: 0
            }
            }
        },



    {
        path: '',
        data: {
          menu: {
            title: 'Taller',
            icon: 'ion-star',
            selected: false,
            expanded: false,
            order: 0
          }
        },
        children: [
            {
                path: 'services',
                data: {
                menu: {
                    title: 'general.menu.services',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },

            {
                path: 'project_services',
                data: {
                menu: {
                    title: 'general.menu.project_services',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            {
                path: 'service_employees',
                data: {
                menu: {
                    title: 'general.menu.service_employees',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            }/* ,
            {
                path: 'validations',
                data: {
                menu: {
                    title: 'general.menu.validations',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            } */
        ]
    },
    {
        path: '',
        data: {
          menu: {
            title: 'Almacen',
            icon: 'ion-star',
            selected: false,
            expanded: false,
            order: 0
          }
        },
        children: [    
            {
                path: 'warehouses',
                data: {
                menu: {
                    title: 'general.menu.warehouses',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            {
                path: 'solicitudewarehouses',
                data: {
                menu: {
                    title: 'general.menu.solicitudewarehouses',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            /* {
                path: 'solicitudewarehouse_products',
                data: {
                menu: {
                    title: 'general.menu.solicitudewarehouse_products',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            {
                path: 'orderins',
                data: {
                menu: {
                    title: 'general.menu.orderins',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            {
                path: 'orderouts',
                data: {
                menu: {
                    title: 'general.menu.orderouts',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            } */

        ]
    },
    {
        path: '',
        data: {
          menu: {
            title: 'Proveedor',
            icon: 'ion-star',
            selected: false,
            expanded: false,
            order: 0
          }
        },
        children: [
            {
                path: 'providers',
                data: {
                menu: {
                    title: 'general.menu.providers',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            {
                path: 'familys',
                data: {
                menu: {
                    title: 'general.menu.familys',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            {
                path: 'products',
                data: {
                menu: {
                    title: 'general.menu.products',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            {
                path: 'solicitudeproviders',
                data: {
                menu: {
                    title: 'general.menu.solicitudeproviders',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            /* {
                path: 'solicitudeprovider_products',
                data: {
                menu: {
                    title: 'general.menu.solicitudeprovider_products',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            }, */
            /* 
            este módulo no debe aparecer en menú..
            {
                path: 'service_products',
                data: {
                menu: {
                    title: 'general.menu.service_products',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            } */
        ]
    },
    {
        path: 'vehicles',
        data: {
        menu: {
            title: 'general.menu.vehicles',
            icon: 'ion-star',
            selected: false,
            expanded: false,
            order: 0
        }
        }
    },
    {
        path: '',
        data: {
          menu: {
            title: 'Empresa',
            icon: 'ion-star',
            selected: false,
            expanded: false,
            order: 0
          }
        },
        children: [

            {
                path: 'companygroups',
                data: {
                menu: {
                    title: 'general.menu.companygroups',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            {
                path: 'companys',
                data: {
                menu: {
                    title: 'general.menu.companys',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            {
                path: 'companyunitss',
                data: {
                menu: {
                    title: 'general.menu.companyunitss',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },

            {
                path: 'employees',
                data: {
                menu: {
                    title: 'general.menu.employees',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            }

        ]
    },
    {
        path: 'reports',
        data: {
        menu: {
            title: 'general.menu.reports',
            icon: 'ion-star',
            selected: false,
            expanded: false,
            order: 0
        }
        }
    },
    {
        path: '',
        data: {
          menu: {
            title: 'Seguridad',
            icon: 'ion-social-buffer',
            selected: false,
            expanded: false,
            order: 0
          }
        },
        children: [
            /* {
                path: 'si_alertas',
                data: {
                menu: {
                    title: 'general.menu.si_alertas',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            }, */
           /*  {
                path: 'si_devices',
                data: {
                menu: {
                    title: 'general.menu.si_devices',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            {
                path: 'si_logs',
                data: {
                menu: {
                    title: 'general.menu.si_logs',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            }, */
            {
                path: 'si_users',
                data: {
                menu: {
                    title: 'general.menu.si_users',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            {
                path: 'si_rols',
                data: {
                menu: {
                    title: 'general.menu.si_rols',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            {
                path: 'si_modulos',
                data: {
                menu: {
                    title: 'general.menu.si_modulos',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            {
                path: 'si_permisos',
                data: {
                menu: {
                    title: 'general.menu.si_permisos',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            },
            /* {
                path: 'si_sesions',
                data: {
                menu: {
                    title: 'general.menu.si_sesions',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            }, */
            /* {
                path: 'si_user_rols',
                data: {
                menu: {
                    title: 'general.menu.si_user_rols',
                    selected: false,
                    expanded: false,
                    order: 0
                }
                }
            } */
        ]
    }


   








    ]
}
];
