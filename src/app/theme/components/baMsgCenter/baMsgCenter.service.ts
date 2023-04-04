import {Injectable} from '@angular/core'

@Injectable()
export class BaMsgCenterService {

  private _notifications = [
    {
      name: 'Cesar',
      text: 'Que tal, me gustaría ver un poco mas de avances..',
      time: '1 min atras'
    },
    {
      name: 'Nasta',
      text: 'Buen día, ya se terminó la barda?.',
      time: '2 hrs atras'
    },
    {
      name: 'Andrey',
      text: 'Que tal Inge, como va todo?.',
      time: '1 dia atras'
    },
    {
      name: 'Nasta',
      text: 'Ya están puestas las ventanas?? para ir a revisarlas, buen día.',
      time: '2 dias atras'
    },
    {
      image: 'assets/img/app/typography/typo06.png',
      text: 'Aqui le mando la imagen de como me gustaría la puerta',
      time: '3 dias atras'
    },
    {
      name: 'Kostya',
      text: 'Pero como? si yo ya les deposité!.',
      time: '1 semana atras'
    }
  ];

  private _messages = [
    {
      name: 'Nasta',
      text: 'After you get up and running, you can place Font Awesome icons just about...',
      time: '1 min ago'
    },
    {
      name: 'Vlad',
      text: 'You asked, Font Awesome delivers with 40 shiny new icons in version 4.2.',
      time: '2 hrs ago'
    },
    {
      name: 'Kostya',
      text: 'Want to request new icons? Here\'s how. Need vectors or want to use on the...',
      time: '10 hrs ago'
    },
    {
      name: 'Andrey',
      text: 'Explore your passions and discover new ones by getting involved. Stretch your...',
      time: '1 day ago'
    },
    {
      name: 'Nasta',
      text: 'Get to know who we are - from the inside out. From our history and culture, to the...',
      time: '1 day ago'
    },
    {
      name: 'Kostya',
      text: 'Need some support to reach your goals? Apply for scholarships across a variety of...',
      time: '2 days ago'
    },
    {
      name: 'Vlad',
      text: 'Wrap the dropdown\'s trigger and the dropdown menu within .dropdown, or...',
      time: '1 week ago'
    }
  ];

  public getMessages():Array<Object> {
    return this._messages;
  }

  public getNotifications():Array<Object> {
    return this._notifications;
  }
}
