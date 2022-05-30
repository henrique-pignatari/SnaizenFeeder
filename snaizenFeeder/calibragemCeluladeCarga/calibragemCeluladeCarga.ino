#include "HX711.h"

HX711 balanca;                                                                        

float calibration_factor = -23500.00;                                                        
float peso;                                                                                 

void setup() {                                                                              
  Serial.begin(9600);                                                                       
  balanca.begin(3, 2);  // SCK= pino 2 e DT= pino 3                                                            
  Serial.println("Remova todos os pesos da balança");                                       
  int seconds = 5;
  for(int i = 0; i<seconds; i++){
    Serial.println(seconds-i);
    delay(1000);
  }                                                                           
  Serial.println("Pressione + para incrementar o fator de calibração");                     
  Serial.println("Pressione - para decrementar o fator de calibração");                     
  delay(1000);                                                                              
  balanca.set_scale();                                                                      
  balanca.tare();                                                                           

  long zero_factor = balanca.read_average();                                                
}

void loop() {                                                                               

  balanca.set_scale(calibration_factor);                                                    

  Serial.print("Peso: ");                                                                   
  peso = balanca.get_units(), 10;                                                         
  if (peso < 0)                                                                             
  {
    //peso = 0.00;                                                                            
  }                                                  
  Serial.print(peso);                                                                       
  Serial.print(" kg");                                                                      
  Serial.print(" Fator de calibração: ");                                                   
  Serial.print(calibration_factor);                                                         
  Serial.println();                                                                         
  delay(500);                                                                               

  if(Serial.available())                                                                    
  {
    char temp = Serial.read();
    if(temp == '+')                                                                         
      calibration_factor += 1;                                                              
    else if(temp == '-')                                                                    
      calibration_factor -= 1;                                                              
  }
}
