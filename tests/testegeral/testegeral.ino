#include <Servo.h>
#include <LiquidCrystal_I2C.h>
#include <ArduinoJson.h>
#include <SD.h>
#include <SPI.h>
#include "Wire.h"

#define CS_PIN 53
#define buttonPin 31
#define relayPin 30
#define changePin 29
#define DS1307_ADDRESS 0x68
#define LCD_ADDRESS 0x3F
#define SERVO 2

bool buttonState,lastButtonState;
bool SDavailable = true;
int nextId = 0;
int nextHour, nextMinute;
double nextWeight;
char bufferArr[2];
byte zero = 0x00; 
int pos;

LiquidCrystal_I2C lcd(LCD_ADDRESS,20,4);

File file;
Servo servo;


void SelecionaDataeHora()   //Seta a data e a hora do DS1307
{
  byte segundos = 00; //Valores de 0 a 59
  byte minutos = 56; //Valores de 0 a 59
  byte horas = 8; //Valores de 0 a 23
  byte diadasemana = 1; //Valores de 0 a 6 - 0=Domingo, 1 = Segunda, etc.
  byte diadomes = 9; //Valores de 1 a 31
  byte mes = 5; //Valores de 1 a 12
  byte ano = 22; //Valores de 0 a 99
  
  Wire.beginTransmission(DS1307_ADDRESS);
  Wire.write(zero);
  
  Wire.write(ConverteParaBCD(segundos));
  Wire.write(ConverteParaBCD(minutos));
  Wire.write(ConverteParaBCD(horas));
  Wire.write(ConverteParaBCD(diadasemana));
  Wire.write(ConverteParaBCD(diadomes));
  Wire.write(ConverteParaBCD(mes));
  Wire.write(ConverteParaBCD(ano));
  Wire.write(zero);
  Wire.endTransmission();
}

byte ConverteParaBCD(byte val)
{ 
  //Converte o número de decimal para BCD
  return ( (val/10*16) + (val%10) );
}

void setup() {
  Serial.begin(115200);
  Serial1.begin(115200);
  while(!Serial){}
  
  pinMode(CS_PIN, OUTPUT);
  pinMode(buttonPin, INPUT);
  pinMode(relayPin,OUTPUT);
  pinMode(changePin,OUTPUT);
  digitalWrite(changePin,!SDavailable);
  Wire.begin();

  lcd.init();
  lcd.backlight();

  servo.attach(SERVO);
  servo.write(0);
  ///*SelecionaDataeHora()*/
  selectSchedule(getHour(2));
}

void loop() {
  if(checkHour()){
    digitalWrite(relayPin,HIGH);
    
    for(pos = 0; pos < 90; pos++)
    {
      servo.write(pos);
      delay(15);
    }
    
  }
  
  if(readConfirmButton()){
    Serial.println("DESLIGANDO");
    digitalWrite(relayPin,LOW);
    for(pos = 90; pos >= 0; pos--)
    {
      servo.write(pos);
      delay(15);
    }
  }

  printHour(getHour(3));

  if(Serial1.available()){
    Serial1.readBytes(bufferArr,1);

    if(bufferArr[0] == 'a'){
      SDavailable = false;
      digitalWrite(changePin,!SDavailable);
      Serial1.print('z');
    }
    if(bufferArr[0] == 'b'){
      SDavailable = true;
      Serial1.print('y');
      digitalWrite(changePin,!SDavailable);
      delay(50);
      selectSchedule(getHour(2));
      Serial1.print(nextMinute);
    }
  }
}

void printHour(String nowHour){
  lcd.setCursor(5,0);
  lcd.print("SmartEatPet");
  lcd.setCursor(6,1);
  int hr = (nowHour.substring(0,nowHour.indexOf(':'))).toInt();
  int mn = (nowHour.substring(nowHour.indexOf(':')+1,nowHour.indexOf(';'))).toInt();
  int sec = (nowHour.substring(nowHour.indexOf(';')+1)).toInt();
  
  if(hr < 10){
    lcd.print("0");
  }
  lcd.print(hr);
  lcd.print(":");
  
  if(mn < 10){
    lcd.print("0");
  }
  lcd.print(mn);
  lcd.print(":");
  
  if(sec < 10){
    lcd.print("0");
  }
  lcd.print(sec);
}

boolean checkHour(){
  String nowHour = getHour(2);
  
  int hr = (nowHour.substring(0,nowHour.indexOf(':'))).toInt();
  int mn = (nowHour.substring(nowHour.indexOf(':')+1)).toInt();
  
  if(nextHour == hr && nextMinute == mn){
    nextSchedule();
    return HIGH;
  }
  return LOW;
}

boolean readConfirmButton(){
  buttonState = digitalRead(buttonPin);
  
  if (buttonState != lastButtonState) {
    lastButtonState = buttonState;
    delay(50);
    return buttonState;
  }else{
    return LOW;
  }
}

byte convertToDecimal(byte val)  
{ 
  //Converte de BCD para decimal
  return ( (val/16*10) + (val%16) );
}

String getHour(int infos){
  Wire.beginTransmission(DS1307_ADDRESS);
  Wire.write(zero);
  Wire.endTransmission();
  Wire.requestFrom(DS1307_ADDRESS, 7);
  int seconds = convertToDecimal(Wire.read());
  int minutes = convertToDecimal(Wire.read());
  int hours = convertToDecimal(Wire.read() & 0b111111);
  int weekDay = convertToDecimal(Wire.read()); 
  int Sday = convertToDecimal(Wire.read());
  int Smonth = convertToDecimal(Wire.read());
  int Syear = convertToDecimal(Wire.read());

  String nowHour = "";
  nowHour.concat(hours);
  nowHour.concat(":");
  nowHour.concat(minutes);
  
  if(infos == 2){
    return nowHour;
  }else if(infos == 3){
    nowHour.concat(";");
    nowHour.concat(seconds);
    return nowHour;
  }
}

String readSD(String fileName){
  if(SDavailable){
    while (!SD.begin())
    {
      Serial.println("FAIL");
    }
    file = SD.open(fileName);
    
    String content = "";
    while(file.available()){
      file.readBytes(bufferArr,1);
      content.concat(bufferArr[0]);
    }
    file.close();
    SD.end();
    return content;
  }else{
    return "unavailable";
  }
}

void selectSchedule(String nowHour){
  
  int hr = (nowHour.substring(0,nowHour.indexOf(':'))).toInt();
  int mn = (nowHour.substring(nowHour.indexOf(':')+1)).toInt();
  
  StaticJsonDocument<1024> doc;
  String schedules_SD = readSD("teste2.txt");
  if(schedules_SD == "unavailable"){
     return;
  }
  Serial.println(schedules_SD);
  DeserializationError error = deserializeJson(doc, schedules_SD);
  
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  
  for (JsonObject item : doc["data"].as<JsonArray>()) {
    String _id = item["id"];
    String _hour = item["hour"];
    String _weight = item["weight"];
    
    int item_id = _id.toInt();
    int item_hr = (_hour.substring(0,_hour.indexOf(':'))).toInt();
    int item_mn = (_hour.substring(_hour.indexOf(':')+1)).toInt();
    double item_weight = _weight.toFloat();
    
    if(item_id == 1){
      nextId = item_id;
      nextHour = item_hr;
      nextMinute = item_mn;
      nextWeight = item_weight;  
    }
    
    if(hr > item_hr ||(hr == item_hr && mn >= item_mn)){
      continue;
    }

    //hora igual minuto menor
    //hora menor
    
    nextId = item_id;
    nextHour = item_hr;
    nextMinute = item_mn;
    nextWeight = item_weight;
    break;    
  }
  Serial.println(nextId);
  Serial.println(nextHour);
  Serial.println(nextMinute);
  Serial.println(nextWeight);
}

void nextSchedule(){
  StaticJsonDocument<1024> doc;
  String schedules_SD = readSD("teste2.txt");
  if(schedules_SD == "unavailable"){
     return;
  } 
  DeserializationError error = deserializeJson(doc, schedules_SD);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  int first_id, first_hr, first_mn;
  double first_weight;
  for (JsonObject item : doc["data"].as<JsonArray>()) {
    String _id = item["id"];
    String _hour = item["hour"];
    String _weight = item["weight"];

    int item_id = _id.toInt();
    int item_hr = (_hour.substring(0,_hour.indexOf(':'))).toInt();
    int item_mn = (_hour.substring(_hour.indexOf(':')+1)).toInt();
    double item_weight = _weight.toFloat();

    if(item_id == 1){
      first_id = item_id;
      first_hr = item_hr;
      first_mn = item_mn;
      first_weight = item_weight;  
    }
    
    if(nextId == (item_id-1)){
      nextId = item_id;
      nextHour = item_hr;
      nextMinute = item_mn;
      nextWeight = item_weight;
      return;
    }
  }
  nextId = first_id;
  nextHour = first_hr;
  nextMinute = first_mn;
  nextWeight = first_weight;
}-
