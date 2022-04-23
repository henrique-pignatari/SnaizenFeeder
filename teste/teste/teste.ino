#include <ArduinoJson.h>
double numberOfChars = 0;

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
  Serial.begin(9600);
  delay(300);
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
    DynamicJsonDocument doc(((int)numberOfChars)*2);
    
    deserializeJson(doc,stringJSON);
    
    schedulesArray = doc["data"].as<JsonArray>();
    return schedulesArray;
  }
}

String readFromSerial(){
  String receivedJSON = "";  
  if(Serial.available() > 0){
    int nBytesRead = Serial.readBytesUntil('f',readBuffer,32);
    
    numberOfChars = 0;
    for(int i = 0; i < nBytesRead; i++){
      double num = ((int)readBuffer[i]-48) * pow(10,(nBytesRead-(i+1)));
      numberOfChars += num;
    }
    
    receivedJSON="";            
    for(int i = 0; i < (numberOfChars+1); i++){
      Serial.readBytes(readBuffer,1);
      if(readBuffer[0] == 'f'){
        Serial.readBytes(readBuffer,1);
        if(readBuffer[0] == 10){
          return receivedJSON;
        }
      }else if((int)readBuffer[0] != 9 && (int)readBuffer[0] != 32){
        receivedJSON.concat(readBuffer[0]);
      }
    }
  }
}
