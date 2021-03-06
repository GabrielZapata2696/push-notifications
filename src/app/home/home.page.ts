import { ApplicationRef, Component, OnInit } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload, OSNotification } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mensajes: OSNotificationPayload[] = [];

  constructor(
    public pushService: PushService,
    private applicationRef: ApplicationRef
  ) { }

  ngOnInit() {
    this.pushService.pushListener.subscribe((notification: any) => {
      this.mensajes.unshift(notification);
      this.applicationRef.tick();
    });
  }

  async ionViewWillEnter() {
    this.mensajes = await this.pushService.getMensajesStorage();
  }

  async borrrarMensaje() {
    if (confirm('¿Está seguro de borrar todos los mensajes?')) {
      await this.pushService.borrarMensajes();
      this.mensajes = [];
    }

  }

}
