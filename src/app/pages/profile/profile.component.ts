import { Si_liquidacionsInterface } from './../si_liquidacions/components/si_liquidacions-table/si_liquidacions.interface';
import { Si_clientesInterface } from './../si_clientes/components/si_clientes-table/si_clientes.interface';
import { Si_clientesResponseInterface } from './../si_clientes/components/si_clientes-table/si_clientes-response.interface';
import { Si_clientesService } from './../si_clientes/components/si_clientes-table/si_clientes.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../shared/services/auth.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { ToasterService } from './../../shared/services/auth.service';
import { Si_facturacionsInterface } from './../si_facturacions/components/si_facturacions-table/si_facturacions.interface';
import { Si_facturacionsAddModalComponent } from './../si_facturacions/components/si_facturacions-table/si_facturacions-add-modal/si_facturacions-add-modal.component';
import { Si_sugerenciasInterface } from './../si_sugerencias/components/si_sugerencias-table/si_sugerencias.interface';
import { Si_sugerenciasAddModalComponent } from './../si_sugerencias/components/si_sugerencias-table/si_sugerencias-add-modal/si_sugerencias-add-modal.component';
import { CommonService } from '../../shared/services/common.service';


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    item: any;
    idsi_cliente: number;

  _liquidacion: Si_liquidacionsInterface[] = [];
  _liquidacion_filtered: Si_liquidacionsInterface[] = [];

    // Permisos en vista
    updateable = false;
    deleteable = false;
    writeable = false;

    filterQuery1: string;
    filterQuery2: string;

    mesActual: string;

    constructor(
      private service: Si_clientesService, 
      private toastrService: ToasterService, 
      private dialogService: DialogService, 
      private authService: AuthService, 
      private route: ActivatedRoute, 
      private router: Router,
      private commonService: CommonService) {

      // Buscar permisos del usuario en el módulo
      const user = this.authService.useJwtHelper();
      
      if (user.super) {
        this.updateable = true;
        this.deleteable = true;
        this.writeable = true;
      } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
          for (const element in userModules) {
            if (userModules[element].path === '/pages/si_clientes') {
              this.updateable = userModules[element].updateable;
              this.deleteable = userModules[element].deleteable;
              this.writeable = userModules[element].writeable;
            }
          }
        }
      }
    }
    ngOnInit() {
      this.refill();

      // Fecha actual para estado de cuenta
      this.mesActual = this.commonService.getDate();
    }
    refill() { 
      this.route.params.subscribe(params => {
        if (params['idsi_cliente'] !== undefined) {
          this.idsi_cliente = +params['idsi_cliente'];
          this.findByIdResidente(this.idsi_cliente);
        }
      });
    }
    private findByIdResidente(id: number): void {
      this.service
        .findById(id)
        .subscribe(
            (data: Si_clientesResponseInterface) => {
                if (data.success) {
                  data.result.servicios.map(vivienda => vivienda.liquidaciones = data.result.liquidaciones.filter(liquidacion => liquidacion.numero === vivienda.numero));
                  this.item = data.result;
                  console.log(this.item);
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    
    viewPersona(clientes: Si_clientesInterface, contacto?: boolean) {
      this.router.navigate([`/pages/si_personas/cliente/${clientes.idsi_cliente}`]);
    }
    viewPagoliquidacion(clientes: Si_clientesInterface) {
      this.router.navigate([`/pages/si_pagoliquidacions/cliente/${clientes.idsi_cliente}`]);
    }
    viewPago(clientes: Si_clientesInterface) {
      this.router.navigate([`/pages/si_pagos/cliente/${clientes.idsi_cliente}`]);
    }
    viewLiquidacion(clientes: Si_clientesInterface) {
      this.router.navigate([`/pages/si_liquidacions/cliente/${clientes.idsi_cliente}`]);
    }
    pagarFactura(item: any) {
      this.router.navigate([`/pages/si_pagos/producto/${item.idliquidacion}`]);
    }
    insertFacturacion(clientes: Si_clientesInterface) {
      const facturacion: Si_facturacionsInterface = {
        si_cliente_idsi_cliente: clientes.idsi_cliente
      }
      const disposable = this.dialogService.addDialog(Si_facturacionsAddModalComponent, facturacion)
      .subscribe( data => {
          if (data) {
              this.facturacionShowToast(data);
          }
      });
    }
    facturacionShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewFacturacion(clientes: Si_clientesInterface) {
      this.router.navigate([`/pages/si_facturacions/cliente/${clientes.idsi_cliente}`]);
    }
    insertSugerencia(idservicio: number, servicio: string) {
      const sugerencia: Si_sugerenciasInterface = {
        si_cliente_idsi_cliente: this.idsi_cliente,
        si_servicio_idsi_servicio: idservicio
      }
      const disposable = this.dialogService.addDialog(Si_sugerenciasAddModalComponent, sugerencia)
      .subscribe( data => {
          if (data) {
              this.sugerenciaShowToast(data);
          }
      });
    }
    sugerenciaShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSugerencia(clientes: Si_clientesInterface) {
      this.router.navigate([`/pages/si_sugerencias/cliente/${clientes.idsi_cliente}`]);
    }

}