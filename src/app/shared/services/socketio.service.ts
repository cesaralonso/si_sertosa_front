  
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import * as socketIo from 'socket.io-client';
import { Action, User, Message, Event } from '../models';
import { CommonService } from './common.service';


@Injectable()
export class SocketIOService {
    serverUrl: string;
    user: any;

    constructor(
        private authService: AuthService,
        private commonService: CommonService) {
        this.serverUrl = environment.server;
        // USER
        this.user = this.authService.useJwtHelper();
    }

    private socket;

    initSocket(): void {
        this.socket = socketIo(this.serverUrl);
    }

    send(message: Message): void {

        const fecha = this.commonService.getMomentTime();
        const hora = this.commonService.getMomentDate();
        
        // Send it now
        message['from'] = this.user;
        message['date'] = fecha;
        message['hour'] = hora;

        console.log('send message', message);

        if (message.type === 'ALERTA') {
            this.socket.emit('message', message);
        } else if (message.type === 'TRACKING') {
            this.socket.emit('tracking', message);
        }
    }

    onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            console.log('onMessage');
            this.socket.on('message', (data: Message) => {
                    console.log('onMessage data', data);
                    observer.next(data);
                });
        });
    }

    onTracking(): Observable<Message> {
        return new Observable<Message>(observer => {
            console.log('onTracking');
            this.socket.on('tracking', (data: Message) => {
                    console.log('onTracking data', data);
                    observer.next(data);
                });
        });
    }

    onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}
