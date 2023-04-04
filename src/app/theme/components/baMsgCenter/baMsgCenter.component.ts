import { SocketIOService } from './../../../shared/services/socketio.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../shared/services/auth.service';
import { BaMsgCenterService } from './baMsgCenter.service';
import { Message, Event, Type } from '../../../shared/models';
import * as _ from 'lodash';


@Component({
  selector: 'ba-msg-center',
  providers: [BaMsgCenterService],
  styleUrls: ['./baMsgCenter.scss'],
  templateUrl: './baMsgCenter.html'
})
export class BaMsgCenter implements OnInit {

  chatcontent: string = '';
  recibidas: any = [];
  totalNoLeidas: number = 0;
  user;
  messages: any[] = [];
  messagesTrack: any[] = [];
  ioConnection: any;
  totalReceived = 0;


  constructor(
      private authService: AuthService,
      private socketIOService: SocketIOService) {
  }

  ngOnInit() {
    this.user = this.authService.useJwtHelper();
    this.initIoConnection();
  }

  private initIoConnection(): void {
    this.socketIOService.initSocket();

    this.ioConnection = this.socketIOService.onMessage()
      .subscribe((message: Message) => {
        this.onMessage(message);
      });

    this.ioConnection = this.socketIOService.onTracking()
      .subscribe((message: Message) => {
        this.onTracking(message);
      });

    this.socketIOService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected IO');
      });

    this.socketIOService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected IO');
      });
  }

  onMessage(message: Message) {
      console.log('onMessage message', message);

      if ( message.from.idsi_user !== undefined ) {
          console.log("message.from.idsi_user", message.from.idsi_user);
      } else {
        // NO PERMITE EL CHAT
        console.log('NO PERMITE EL CHAT');
        return false;
      }

      //  AUMENTA CONTADOR DE NOTIFICACIONES NO LEIDAS
      this.totalNoLeidas++;

      const _message = {
        remitente: message.from.usuario || message.from.email.split('@')[0],
        mensaje: message.content.category === 'REGISTRO-CREADO-ONLINE' 
          ? 'Nuevo Registro Online' 
          : 'Nuevo Registro Offline',
        insertId: message.content.result.insertId,
        date: message.date,
        hour: message.hour
      };

      this.messages.push(_message);
  }

  onTracking(message: Message) {
    console.log('onTracking message', message);

    if ( message.from.idsi_user !== undefined ) {
        console.log("message.from.idsi_user", message.from.idsi_user);
    } else {
      // NO PERMITE EL TRACKING
      console.log('NO PERMITE EL TRACKING');
      return false;
    }

    //  AUMENTA CONTADOR DE NOTIFICACIONES NO LEIDAS
    this.totalReceived++;

    const _messageTrack = {
      remitente: message.from.usuario || message.from.email.split('@')[0],
      mensaje: 'ENVIANDO POSICIÓN',
      date: message.date,
      hour: message.hour
    };

    this.messagesTrack = [...this.messagesTrack, _messageTrack];
    this.messagesTrack = _.uniqBy(this.messagesTrack, 'remitente');
  }

  marcarComoLeidas() {
    this.messages = [];
    this.totalNoLeidas = 0;
  }

}
