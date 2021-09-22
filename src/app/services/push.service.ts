import { EventEmitter, Injectable } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: OSNotificationPayload[] = [
    // {
    //   title: 'Titulo del push',
    //   body: 'Body del push message',
    //   date: new Date()
    // }
  ];

  pushListener = new EventEmitter<OSNotificationPayload>();


  constructor(
    private oneSignal: OneSignal,
    private storage: Storage
  ) {
    this.storage.create();
  }

  configInicial() {
    this.oneSignal.startInit('34aacbcf-cbb5-4995-8263-46f4eaf8dcea', '98743423257');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((notificacion) => {
      // do something when notification is received
      // console.log('Notificación recibida', notificacion)
      this.notificacionRecibida(notificacion);
    });

    this.oneSignal.handleNotificationOpened().subscribe(async (notificacion) => {
      // do something when a notification is opened
      // console.log('Notificación abierta', notificacion)
      await this.notificacionRecibida(notificacion.notification);
    });

    this.oneSignal.endInit();
  }


  async notificacionRecibida(notificacion: OSNotification) {
    await this.cargarMensajes();
    const payload = notificacion.payload;
    const existePush = this.mensajes.find(mensaje => mensaje.notificationID === payload.notificationID);

    if (existePush) {
      return;
    }
    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);
    await this.guardarMensajes();
  }

  guardarMensajes() {
    this.storage.set('mensajes', this.mensajes);
  }

  async cargarMensajes() {

    this.mensajes = await this.storage.get('mensajes') || [];
    return this.mensajes;
  }

  async getMensajesStorage() {
    await this.cargarMensajes();
    return [...this.mensajes];
  }

}
