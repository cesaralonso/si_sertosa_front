import { Configuration } from './../../app.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SwPush } from '@angular/service-worker';


@Injectable({ providedIn: 'root' })
export class PushNotificationService {

  constructor(private http: HttpClient,
              private swPush: SwPush,
              private configuration: Configuration) {
  }

  addPushSubscriber(iduser: number, idrol: number) {
    this.swPush.requestSubscription({
      serverPublicKey: environment.vapid_public_key
    })
    .then(sub => {
      const tokenPayload = {
          'token': sub,
          'iduser': iduser,
          'idrol': idrol
      };
      console.log('tokenPayload', tokenPayload);

      this.http.post(`${this.configuration.apiUrl}app/save-token`, tokenPayload).subscribe(
        () => console.log('Subscription added successfully.'),
        err => console.error('Could not send subscription object to server, reason: ', err)
      );
    })
    .catch(err => console.error('Could not subscribe to notifications', err));
  }

}
