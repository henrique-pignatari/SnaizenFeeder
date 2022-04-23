#include <HX711.h>
#include <LiquidCrystal.h>
#include "RTClib.h"
#include <ArduinoJson.h>

char readBuffer[32];

void printSchedulesInfos(JsonArray schedulesArray){
  for(JsonObject data_item : schedulesArray){
      String id = data_item["id"];
      String hour = data_item["hour"];
      String separetedHour[2];
      int index = hour.indexOf(':');
      separetedHour[0] = hour.substring(0,index);
      separetedHour[1] = hour.substring(index+1);

      Serial.print(id);
      Serial.print(" ");
      Serial.print(separetedHour[0].toInt());
      Serial.print(" ");
      Serial.println(separetedHour[1].toInt());
    }
}

void setup() {
  Serial.begin(115200);
  initClock();
  initCells();
}

void loop() {
  if(Serial.available() > 0){
    String schedulesJsonString = readFromSerial();
    JsonArray schedulesArray = getSchedulesInfos(schedulesJsonString);
    printSchedulesInfos(schedulesArray);
  }
}

JsonArray getSchedulesInfos(String stringJSON){
  JsonArray schedulesArray;
  
  if(stringJSON != ""){
    DynamicJsonDocument doc(stringJSON.length()*2);
    
    deserializeJson(doc,stringJSON);
    
    schedulesArray = doc["data"].as<JsonArray>();
    return schedulesArray;
  }
}

String readFromSerial(){
  String receivedJSON = "{\"data\":[";
  while(true){
    Serial.readBytes(readBuffer,1);
    if(readBuffer[0] == 'f'){
      break;
    }else if((int)readBuffer[0] != 9 && (int)readBuffer[0] != 32){
      receivedJSON.concat(readBuffer[0]);
    }
  }
  receivedJSON.concat("]}");
  return receivedJSON; 
}

//Rotinas de inicialização
void initClock(){
  Serial.println("Inicializando o relogio"); //TEMP
}

void initCells(){
  Serial.println("Inicializando celula de carga"); //TEMP
}

//Celula de carga

//Relogio

//LCD
void emitirMensagemLCD(String mensagem){
  Serial.print("Imprimindo mensagem no LCD: ");
  Serial.println(mensagem);
}

void emitirMensagemLCDTemporizada(String mensagem, int segundos){
  emitirMensagemLCD(mensagem);
  Serial.print("LCD travado por ");
  Serial.print(segundos);
  Serial.println("segundos");
  //Travar o LCD
}
