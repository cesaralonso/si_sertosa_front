import { Component, Input, OnInit } from '@angular/core';



@Component({
  selector: 'app-information-cards',
  templateUrl: './information-cards.component.html',
  styleUrls: ['./information-cards.component.scss']
})
export class InformationCardsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input('information')
  infocards;
}
