  import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
  @Component({
    selector: 'projects',
    templateUrl: './projects.html'
  })
  export class ProjectsComponent implements OnInit {
    routeParamsSubs: Subscription;
    idproject: number;

    constructor(
      private route: ActivatedRoute ) {
    }    
    
    ngOnInit() {
      this.refill();
    }

    ngOnDestroy() {
        this.routeParamsSubs.unsubscribe();
    }

    refill() { 
      this.routeParamsSubs = this.route.params.subscribe(params => {
        if (params['idproject'] !== undefined) {
          this.idproject = +params['idproject'];
          console.log('idproject', this.idproject);
        }
      });
    }

  }
