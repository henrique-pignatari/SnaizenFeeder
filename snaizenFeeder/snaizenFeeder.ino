#include <HX711.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiServer.h>
#include <WiFiUdp.h>
#include <LiquidCrystal.h>
#include <EEPROM.h>
#include "RTClib.h"

//teste

boolean horariosConfigurados;

void setup() {
  Serial.begin(9600);
  inicializarWIFI();
  inicializarRelogio();
  inicializarBluetooth();
  inicializarCelulaDeCarga();
  horariosConfigurados = conferirHorarios();
}

void loop() {
  if(false){//TEMP  Se há informções chegando na serial
    
  }
  if(horariosConfigurados){
    //todo o resto da aplicacao
  }else{
    emitirMensagemLCD("Sincronizar Relogio");
  }

}

//Rotinas de inicialização
void inicializarWIFI(){
  Serial.println("Inicializando o WIFI"); //TEMP
  if(!true){//Se o wifi não conectar
    emitirMensagemLCDTemporizada("Falha na conexao com o wifi",35);
  }
}

void inicializarRelogio(){
  Serial.println("Inicializando o relogio"); //TEMP
  Serial.println("Conferindo se o horario continua sincronizado");
  
  if(false){//Se o horarionão estiverem sincronizado
    Serial.println("Sincronizando horarios com o wifi");
  }
  Serial.println("Fim inicializar Relogio");
}

void inicializarBluetooth(){
  Serial.println("Inicializando o Bluetooth"); //TEMP
}

void inicializarCelulaDeCarga(){
  Serial.println("Inicializando celula de carga"); //TEMP
}

boolean conferirHorarios(){//retorna true se há horarios cnfigurados ou false se nao
  Serial.println("Conferindo se ha horarios cadastrados"); //TEMP
  Serial.println("Conferindo integridade dos dados");
  String horarios[] = {"12:30"};
  String horariosSanitizados = sanitizarHorarios(horarios);
  Serial.println("Fim conferencia horarios");
  return true;
}

String sanitizarHorarios(String a[]){
  Serial.println("Sanitizando horarios");
  return a[0];
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
