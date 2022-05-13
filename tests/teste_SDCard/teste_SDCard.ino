#include <Wire.h>
#include <SD.h>
#include <SPI.h>
int CS_PIN = 53;
char bufferArr[1]; 
File file;
 
void setup(void)
{
  Serial.begin(9600);
  //Inicializa o cartao SD
  //inicia_SD();
  pinMode(CS_PIN, OUTPUT);
  while(!Serial){}
  while (!SD.begin())
  {
    Serial.println("falha");
  }
}
 
void loop(void)
{ 
  if(Serial.available()){
    Serial.readBytes(bufferArr,1);
    if(bufferArr[0] == 'a'){
      grava_SD("teste.txt","MENSAGEM 1");
    }else if(bufferArr[0] == 'b'){
      grava_SD("teste.txt","MENSAGEM 2");
    }else if(bufferArr[0] == 'r'){
      le_SD("teste.txt");
    }else if(bufferArr[0] == 'd'){
      deleta_SD("teste.txt");
    }
  }
}

void le_SD(char fileName[]){
  file = SD.open(fileName);
  String content = "";
  while(file.available()){
    file.readBytes(bufferArr,1);
    content.concat(bufferArr[0]);
  }
  Serial.println(content);
}

void deleta_SD(char fileName[]){
  SD.remove(fileName);
}
 
//Grava dados no cartao SD
void grava_SD(char filename[],String mensagem)
{
  file = SD.open(filename, FILE_WRITE);
  file.println(mensagem);
  fecha_arquivo();
}
 
void fecha_arquivo()
{
  if (file)
  {
    file.close();
  }
}
