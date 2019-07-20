import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AlertController } from '@ionic/angular';


import { LedService } from './services/led/led.service';





@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public fcm: FCM,
    private localNotifications: LocalNotifications,
    public alertController: AlertController,
    public ledSvc: LedService) {


    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();


      // Notificaciones
      this.fcm.subscribeToTopic('all');

      this.fcm.getToken()
        .then(token => {
          console.log('TOKEN:', token);
          alert(token);
          this.ledSvc.postToken(token);
        }).catch(error => {
          // ocurrió un error al procesar el token
          console.log('ERROR:', error);
        });


      this.fcm.onNotification().subscribe(data => {
        console.log('DATA:', data);

        if (this.platform.is('android')) {
          // data.body
          if (data.wasTapped) {
            // Segundo plano
            this.localNotifications.schedule({
              title: data.title,
              text: data.body
            });
          } else {
            // Primer plano
            this.presentAlert(data);
          }
        } else {
          // data.aps.alert
        }
      });


      /**
       * No suscribimos para obtener el nuevo token cuando se realice un refresh y poder seguir procesando las notificaciones
       * */
      this.fcm.onTokenRefresh().subscribe(
        (token: string) => console.log('Nuevo token', token),
        error => console.error(error)
      );
    });
  }


  async presentAlert(data) {
    console.log('PRIMER PLANO:', data);
    const alert = await this.alertController.create({
      header: data.title,
      message: data.body,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            return this.ledSvc.postLedOnOff(1);
          }
        }
      ]
    });

    await alert.present();
  }

}
