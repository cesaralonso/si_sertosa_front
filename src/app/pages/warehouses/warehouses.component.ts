  import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs-compat';
  @Component({
    selector: 'warehouses',
    templateUrl: './warehouses.html'
  })
  export class WarehousesComponent implements OnInit {
    routeParamsSubs: Subscription;
    idwarehouse: number;
    constructor(
      private route: ActivatedRoute) {
    }
    ngOnInit() {
      this.refill();
    }
    ngOnDestroy() {
        this.routeParamsSubs.unsubscribe();
    }
    refill() { 
      this.routeParamsSubs = this.route.params.subscribe(params => {
        if (params['idwarehouse'] !== undefined) {
          this.idwarehouse = +params['idwarehouse'];
        }
      });
    }
  }
