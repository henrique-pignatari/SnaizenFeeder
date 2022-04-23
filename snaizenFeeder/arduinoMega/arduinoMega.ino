#include <HX711.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiServer.h>
#include <WiFiUdp.h>
#include <LiquidCrystal.h>
#include "RTClib.h"

boolean horariosConfigurados;

void setup() {
  Serial.begin(9600);
  initWIFI();
  initClock();
  initCells();
}

void loop() {

}

//Rotinas de inicialização
void initWIFI(){
  Serial.println("Inicializando o WIFI"); //TEMP
  if(!true){//Se o wifi não conectar
    emitirMensagemLCDTemporizada("Falha na conexao com o wifi",35);
  }
}

void initClock(){
  Serial.println("Inicializando o relogio"); //TEMP
  Serial.println("Conferindo se o horario continua sincronizado");
  
  if(false){//Se o horarionão estiverem sincronizado
    Serial.println("Sincronizando horarios com o wifi");
  }
  Serial.println("Fim inicializar Relogio");
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
