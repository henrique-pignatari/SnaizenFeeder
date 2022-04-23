#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>

BLEServer *pServer = NULL;

BLECharacteristic *message_characteristic = NULL;

#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define MESSAGE_CHARACTERISTIC_UUID "6d68efe5-04b6-4a85-abc4-c2670b7bf7fd"

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
          String subString = value.substring(1);
          String line = "";
          if(subString.startsWith("d")){
            Serial.println("Deleting from SD card");
            subString = subString.substring(1);
          }
          if(!subString.endsWith("f")){
            line = "l";
          }
          subString.concat(line);
          Serial.println(subString);
      }else if(value.startsWith("b")){
        Serial.println("SENDING DATA");
        message_characteristic->setValue("3.5");
        message_characteristic->notify();
      }
    }
  }
};

void setup() {
  Serial.begin(115200);
  intiateBLE();
}

void loop() {
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
