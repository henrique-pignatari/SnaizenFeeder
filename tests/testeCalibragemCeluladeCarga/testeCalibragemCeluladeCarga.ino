#include "HX711.h"

const int LOADCELL_DOUT_PIN = 2;
const int LOADCELL_SCK_PIN = 3;
long int value;

HX711 scale;

void setup() {
  Serial.begin(115200);
  Serial.println("HX711 Demo");

  Serial.println("Initializing the scale");
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale();
  scale.tare();
  Serial.println("Coloque o peso");
  int seconds = 10;
  for(int i = 0; i<seconds; i++){
    Serial.println(seconds-i);
    delay(1000);
  }
  long num = scale.get_units(10);
  float escala = (num-scale.get_offset())/1.00f;
  Serial.println("Retire o peso");
  for(int i = 0; i<seconds; i++){
    Serial.println(seconds-i);
    delay(1000);
  }

  scale.set_scale(escala);
  scale.tare();
}

void loop() {
  float peso = scale.get_units();
  char medida[17];
  dtostrf (peso, 7, 3, medida);
  strcat (medida, "Kg");
  Serial.println(medida);
  delay(500);
}
