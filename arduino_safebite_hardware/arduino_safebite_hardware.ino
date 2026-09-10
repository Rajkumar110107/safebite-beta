#include <LiquidCrystal.h>

// RS, E, D4, D5, D6, D7
LiquidCrystal lcd(5, 6, 7, 8, 9, 10);

void setup() {

  lcd.begin(16, 2);

  lcd.clear();

  lcd.setCursor(0, 0);
  lcd.print("MARINE SENTINEL");

  lcd.setCursor(0, 1);
  lcd.print("LCD TEST OK");
}

void loop() {
}