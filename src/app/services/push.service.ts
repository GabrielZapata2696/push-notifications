import { Injectable } from '@angular/core';
import { OneSignal, OSNotification } from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: any[] = [
    {
      title: 'Titulo del push',
      body: 'Body del push message',
      date: new Date()
    }
  ];

  constructor(
    private oneSignal: OneSignal
  ) { }

  configInicial() {
    this.oneSignal.startInit('34aacbcf-cbb5-4995-8263-46f4eaf8dcea', '98743423257');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((notificacion) => {
      // do something when notification is received
      console.log('Notificación recibida', notificacion)
      this.notificacionRecibida(notificacion);
    });

    this.oneSignal.handleNotificationOpened().subscribe((notificacion) => {
      // do something when a notification is opened
      console.log('Notificación abierta', notificacion)
    });

    this.oneSignal.endInit();
  }


  notificacionRecibida(notificacion: OSNotification) {
    const payload = notificacion.payload;
    const existePush = this.mensajes.find(mensaje => mensaje.notificationID === payload.notificationID);

    if (existePush) {
      return;
    }

    this.mensajes.unshift(payload);



  }



}
