import { Component, OnInit, Input, Output } from '@angular/core';
import { ProvidersTableComponent } from 'app/pages/providers/components/providers-table';


@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.scss']
})
export class CardContainerComponent implements OnInit {
  @Input() dataEntrante:any;
  constructor(public insertProduct: ProvidersTableComponent

  ) { }

  ngOnInit(): void {

  }



}

