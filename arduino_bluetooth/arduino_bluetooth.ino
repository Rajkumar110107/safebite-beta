/*
  SafeBite Arduino Bluetooth Broadcaster
  Locked Detection Cycle Architecture
*/

#include <SoftwareSerial.h>

// Define Bluetooth Pins (e.g. HC-05 module)
const int bluetoothTx = 10;
const int bluetoothRx = 11;
SoftwareSerial Bluetooth(bluetoothTx, bluetoothRx);

// Sensor Analog & Digital Pins
const int pinGas        = A0; // MQ-135 Gas Sensor
const int pinIR         = 2;  // IR obstacle/presence sensor (Active LOW)
const int pinLedGreen   = 4;  // Green LED
const int pinLedYellow  = 5;  // Yellow LED
const int pinLedRed     = 6;  // Red LED
const int pinBuzzer     = 7;  // Buzzer
const int pinResetBtn   = 8;  // Reset Button (INPUT_PULLUP)

// State Machine States
enum SafeBiteState {
  STATE_WAITING_FOR_FOOD = 0,
  STATE_CLASSIFIED_LOCKED = 1,
  STATE_FOOD_REMOVED_WAITING_RESET = 2
};

SafeBiteState currentState = STATE_WAITING_FOR_FOOD;
int lockedStatus = 0; // 0=None, 1=Fresh, 2=Warning, 3=Spoiled
int storageDays = 1;

void setLeds(int g, int y, int r) {
  digitalWrite(pinLedGreen, g);
  digitalWrite(pinLedYellow, y);
  digitalWrite(pinLedRed, r);
}

void resetCycle() {
  currentState = STATE_WAITING_FOR_FOOD;
  lockedStatus = 0;
  storageDays = 1;
  setLeds(LOW, LOW, LOW);
}

void setup() {
  Serial.begin(9600);
  Bluetooth.begin(9600);
  
  pinMode(pinGas, INPUT);
  pinMode(pinIR, INPUT);
  pinMode(pinLedGreen, OUTPUT);
  pinMode(pinLedYellow, OUTPUT);
  pinMode(pinLedRed, OUTPUT);
  pinMode(pinBuzzer, OUTPUT);
  pinMode(pinResetBtn, INPUT_PULLUP);
  
  resetCycle();
  Serial.println("SafeBite Bluetooth Broadcaster Ready.");
}

void loop() {
  int gas_value = analogRead(pinGas); 
  int ir_raw = digitalRead(pinIR);
  int presence = (ir_raw == LOW) ? 1 : 0; 
  
  // Check Reset
  if (digitalRead(pinResetBtn) == LOW) {
    tone(pinBuzzer, 1800, 100);
    resetCycle();
    delay(300);
  }
  
  // State Machine
  switch (currentState) {
    case STATE_WAITING_FOR_FOOD:
      if (presence == 1) {
        // One beep
        tone(pinBuzzer, 2400, 120);
        
        // Single classification & lock
        if (gas_value < 200) {
          lockedStatus = 1;
          storageDays = 1;
          setLeds(HIGH, LOW, LOW); // Green ON
        } else if (gas_value <= 450) {
          lockedStatus = 2;
          storageDays = 2;
          setLeds(LOW, HIGH, LOW); // Yellow ON
        } else {
          lockedStatus = 3;
          storageDays = 4;
          setLeds(LOW, LOW, HIGH); // Red ON
        }
        currentState = STATE_CLASSIFIED_LOCKED;
      }
      break;
      
    case STATE_CLASSIFIED_LOCKED:
      if (presence == 0) {
        currentState = STATE_FOOD_REMOVED_WAITING_RESET;
      }
      break;
      
    case STATE_FOOD_REMOVED_WAITING_RESET:
      // Keep locked until reset
      break;
  }

  // Construct Data String
  String statusStr = "READY";
  if (lockedStatus == 1) statusStr = "FRESH";
  else if (lockedStatus == 2) statusStr = "WARNING";
  else if (lockedStatus == 3) statusStr = "SPOILED";

  String payload = "GAS:" + String(gas_value) + 
                   ",IR:" + String(presence) + 
                   ",DAYS:" + String(storageDays) +
                   ",STATUS:" + statusStr;

  Bluetooth.println(payload);
  Serial.println(payload);

  delay(1000); 
}
