#include <SD.h>
#include <SPI.h>
#include "FS.h"
#define CS_PIN 5

char bufferArr[2];
bool SDavailable = false;
File file;

void setup() {
  Serial.begin(115200);
  Serial2.begin(115200);
  pinMode(CS_PIN,OUTPUT);
}

void loop() {

  if(Serial.available()){
      Serial.readBytes(bufferArr,1);
    
    if(bufferArr[0] == 'k'){
      Serial2.print('a');
    }
  }
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

  if(SDavailable){
    Serial.println(readFile(SD,"/teste.txt"));
    Serial2.print('b');
    delay(50);
  }
}

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

    Serial.print("Read from file: ");
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
    SD.end();
    file.close();
}

void appendFile(fs::FS &fs, const char * path, const char * message){
    while (!SD.begin(CS_PIN)){
      Serial.println("FAIL");
    }
    
    Serial.printf("Appending to file: %s\n", path);

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
    SD.end();
    file.close();
}

void deleteFile(fs::FS &fs, const char * path){
    while (!SD.begin(CS_PIN)){
      Serial.println("FAIL");
    }
    Serial.printf("Deleting file: %s\n", path);
    if(fs.remove(path)){
        Serial.println("File deleted");
    } else {
        Serial.println("Delete failed");
    }
    SD.end();
}
