#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <SD.h>
#include <SPI.h>
#include "FS.h"

BLEServer *pServer = NULL;
BLECharacteristic *message_characteristic = NULL;

#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define MESSAGE_CHARACTERISTIC_UUID "6d68efe5-04b6-4a85-abc4-c2670b7bf7fd"
#define CS_PIN 5

char bufferArr[2];
bool SDavailable = false;
File file;

String readFile(fs::FS &fs, const char * path){
    while (!SD.begin(CS_PIN))
    {
      Serial.println("FAIL");
    }
    File file = fs.open(path);
    if(!file){
        Serial.println("Failed to open file for reading");
        return "FAIL";
    }
    
    String content = "";
    while(file.available()){
        file.readBytes(bufferArr,1);
        content.concat(bufferArr[0]);
    }
    file.close();
    SD.end();
    return content;
}

void writeFile(fs::FS &fs, const char * path, const char * message){
    while (!SD.begin(CS_PIN))
    {
      Serial.println("FAIL");
    }
    File file = fs.open(path, FILE_WRITE);
    if(!file){
        Serial.println("Failed to open file for writing");
        return;
    }
    if(file.print(message)){
        Serial.println("File written");
    } else {
        Serial.println("Write failed");
    }
    file.close();
    SD.end();    
}

void appendFile(fs::FS &fs, const char * path, String message){
    while (!SD.begin(CS_PIN)){
      Serial.println("FAIL");
    }
    
    File file = fs.open(path, FILE_APPEND);
    if(!file){
        Serial.println("Failed to open file for appending");
        return;
    }
    if(file.print(message)){
        Serial.println("Message appended");
    } else {
        Serial.println("Append failed");
    }
    file.close();
    SD.end();
}

void deleteFile(fs::FS &fs, const char * path){
    while (!SD.begin(CS_PIN)){
      Serial.println("FAIL");
    }
    if(fs.remove(path)){
        Serial.println("File deleted");
    } else {
        Serial.println("Delete failed");
    }
    SD.end();
}

void requestSD(){
  Serial2.print('a');
}

void endSD(){
  Serial2.print('b');
}

class MyServerCallbacks : public BLEServerCallbacks
{
  void onConnect(BLEServer *pServer)
  {
    Serial.println("Connected");
  };

  void onDisconnect(BLEServer *pServer)
  {
    Serial.println("Disconnected");
    delay(100);
    pServer->getAdvertising()->start();
  }
};

class CharacteristicsCallbacks : public BLECharacteristicCallbacks
{
  void onWrite(BLECharacteristic *pCharacteristic)
  {
    if(pCharacteristic == message_characteristic){
      String value = pCharacteristic->getValue().c_str();
      
      if(value.startsWith("a")){
          requestSD();
          String subString = value.substring(1);
          if(subString.startsWith("d")){
            deleteFile(SD,"/teste2.txt");
            subString = subString.substring(1);
            writeFile(SD,"/teste2.txt","{\"data\":[");
          }
                    
          if(subString.endsWith("f")){
            subString.replace("f","");
            appendFile(SD,"/teste2.txt",subString);
            appendFile(SD,"/teste2.txt","]}");
            Serial.println(subString);
            endSD();
            return;
          }
          appendFile(SD,"/teste2.txt",subString);
          endSD();
      }else if(value.startsWith("b")){
        requestSD();
        String value = readFile(SD,"/teste2.txt");
        value.concat("f");
        
        String bufferStr[(value.length()/20)+1];
        for(int i = 0; i < (value.length()/20)+1; i++){
          if(((i*20)+20)<value.length()){
            bufferStr[i] = value.substring(i*20,(i*20)+20);
          }else{
            bufferStr[i] = value.substring(i*20);
          }
        }

        for(String s : bufferStr){
          message_characteristic->setValue(s.c_str());
          message_characteristic->notify();
        }        
        endSD();
      }
    }
  }
};

void setup() {
  Serial.begin(115200);
  Serial2.begin(115200);
  pinMode(CS_PIN,OUTPUT);
  intiateBLE();
}

void loop() {
  if(Serial2.available()){
    Serial2.readBytes(bufferArr,1);
    
    if(bufferArr[0] == 'z'){
      SDavailable = true;
    }
    if(bufferArr[0] == 'y'){
      SDavailable = false;
    }

    Serial.println(bufferArr[0]);
  }
}

void intiateBLE(){
  // Create the BLE Device
  BLEDevice::init("SnaizenFeeder");
  
  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());
  
  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  delay(100);

  // Create a BLE Characteristic
  message_characteristic = pService->createCharacteristic(
      MESSAGE_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
      BLECharacteristic::PROPERTY_WRITE |
      BLECharacteristic::PROPERTY_NOTIFY |
      BLECharacteristic::PROPERTY_INDICATE);

  // Start the BLE service
  pService->start();

    // Start advertising
  pServer->getAdvertising()->start();

  message_characteristic->setValue("");
  message_characteristic->setCallbacks(new CharacteristicsCallbacks());
  
  Serial.println("Waiting for a client connection to notify...");
}
