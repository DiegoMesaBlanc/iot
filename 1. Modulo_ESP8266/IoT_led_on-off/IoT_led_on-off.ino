//Librerias
#include <Arduino.h>
#include <ArduinoJson.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>


//variables int
int connectLed = 02; // GPIO13 - D4
int ventilador = 16; // D0
int input_val = 0;
const int LM_35 = A0;
int cont = 0;

//variables char
char dato=0;

//variables float
float temp = 0;
float tempBefore = 0;

//variables String
String deviceId = "1";                         //Identificador del dispositivo
String host = "http://201.184.75.194:3000/";   //Servidor



//Variables globales
ESP8266WiFiMulti WiFiMulti;
HTTPClient http;



void setup() {
  Serial.begin(115200);
  
  //Configurar WiFiClient
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP("MacDonald", "Parapapapa+");
  //WiFiMulti.addAP("iPhoneVirus", "Ing.ElectroniK");
  WiFiMulti.addAP("Fmilia MBM", "VirusPiso333+");
  Serial.println();
  Serial.println();
  Serial.print("Conectando");

  while (WiFiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }

  Serial.println();
  Serial.print("WiFi: ");
  Serial.print(WiFi.SSID().c_str());
  Serial.println();
  Serial.println();
  Serial.println();
  
  //Configurar pines
  pinMode(connectLed, OUTPUT);
  pinMode(ventilador, OUTPUT);
}

void loop() {
  if (WiFiMulti.run() == WL_CONNECTED) {
    digitalWrite(connectLed, LOW);
    
    boolean tourOnLed = getStatusLed();
    turnOnOFFLed(tourOnLed);
  } else {
    digitalWrite(connectLed, HIGH);
  }

  delay(2000);
}




//*************************************  API REST *************************************
//Obtiene el estado de la base de datos GET
boolean getStatusLed() {
  boolean turnOnLed = false;
  WiFiClient client;
  
  if (http.begin(client, host + "led/" + deviceId)) {
    int httpCode = http.GET();
    
    Serial.println(httpCode);
    if (httpCode > 0) {
      
      if (httpCode == HTTP_CODE_OK) {
        //analyze response
        String result = http.getString();
        Serial.println(result);
        
        DynamicJsonDocument doc(500);
        deserializeJson(doc, result);
        JsonObject obj = doc.as<JsonObject>();

        String status = obj[String("status")];
        Serial.println(status);

        if (status == "1"){
          turnOnLed = true;
        } else {
          postData();
        }

        refreshTemp();
      }
    }
  }
  
  return turnOnLed;
}


//Realiza un cambio en la base de datos POST
void postData() {

  input_val = analogRead(LM_35) * 0.004882812 * 100;
  temp = (input_val - 273.15) * (-1);
  Serial.print("Temperatura: ");
  Serial.println(temp);

  if(temp > 30) {
    if(cont < 1) {
      cont = 1;
      http.begin(host + "notificacion");
      http.addHeader("Content-Type", "application/json");
      http.POST("");
      //http.PUT("{\"status\":\"1\"}");
    }
  } else {
    cont = 0;
  }
  
  Serial.print("Cont: ");
  Serial.println(cont);
}


//Refrescar temperatura
void refreshTemp() {

  input_val = analogRead(LM_35) * 0.004882812 * 100;
  temp = (input_val - 273.15) * (-1);
  Serial.print("Temperatura después: ");
  Serial.println(temp);

  if(temp != tempBefore) {
    tempBefore = temp;
    Serial.print("Temperatura antes: ");
    Serial.println(tempBefore);
    http.begin(host + "temperatura/" + deviceId);
    http.addHeader("Content-Type", "application/json");
    
    http.PUT("{\"temp\":" + String(temp) + "}");
  }
}

//Maneja el estado del led
void turnOnOFFLed(boolean turnOnLed){
  if (turnOnLed){
    //digitalWrite(pinLed, HIGH);
    digitalWrite(ventilador, HIGH);
  } else {
    //digitalWrite(pinLed, LOW);
    digitalWrite(ventilador, LOW);
  }
}
