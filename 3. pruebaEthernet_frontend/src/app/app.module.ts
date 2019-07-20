import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { FCM } from '@ionic-native/fcm/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';



const firebase = {
  apiKey: 'AIzaSyCbu9FoPxtb9jrjdhL4TRnuQn4ik1pETeM',
  authDomain: 'iotnotifications-c6d28.firebaseapp.com',
  databaseURL: 'https://iotnotifications-c6d28.firebaseio.com',
  projectId: 'iotnotifications-c6d28',
  storageBucket: 'iotnotifications-c6d28.appspot.com',
  messagingSenderId: '356053003456'
};



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebase),
    AngularFirestoreModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FCM,
    Firebase,
    LocalNotifications
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
