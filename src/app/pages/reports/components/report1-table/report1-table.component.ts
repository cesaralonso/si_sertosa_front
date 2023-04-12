
import { Component, OnInit } from '@angular/core';
import { Report1Interface } from './report1.interface';
import { ReportsService } from '../../reports.service';

@Component({
    'selector': 'report1-table',
    'templateUrl': 'report1-component.html',
    'styleUrls': ['report1.component.scss']
})
export class Report1TableComponent implements OnInit {


    report: Report1Interface[] = [];


    constructor(
        private reportsService: ReportsService
    ) {

    }

    async ngOnInit() {

        const response = await this.reportsService.allReport1()
            .toPromise();


        this.report = response.result;


    }


}