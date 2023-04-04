import { Component, AfterViewInit, Input } from '@angular/core';
declare var jQuery;

@Component({
selector: 'app-card-flip',
templateUrl: './card-flip.component.html',
styleUrls: ['./card-flip.component.scss'],
})
export class CardFlipComponent implements AfterViewInit {

    @Input()
    set data(data: string){
      this.title = data[0];
      this.logo = data[1];
    }
    _data: string;

    title: string;
    logo: string;
  

    constructor() {
    }

    ngAfterViewInit() {
    }

    clickCard(_that: Element) {
        var zindex = 10;
        var isShowing = false;
        
        if (jQuery(_that).hasClass("d-card-show")) {
          isShowing = true
        }
    
        if (jQuery("div.flip-cards").hasClass("showing")) {
          // a card is already in view
          jQuery("div.card.d-card-show")
            .css({zIndex: ''})
            .removeClass("d-card-show");
    
          if (isShowing) {
            // this card was showing - reset the grid
            jQuery("div.flip-cards")
              .removeClass("showing");
          } else {
            // this card isn't showing - get in with it
            jQuery(_that)
              .css({zIndex: zindex})
              .addClass("d-card-show");
          }
          zindex++;
    
        } else {
          // no flip-cards in view
          jQuery("div.flip-cards")
            .addClass("showing");
          jQuery(_that)
            .css({zIndex: zindex})
            .addClass("d-card-show");
          zindex++;
        }
    }

  }
