const int led = 10;
const int button = 12;
const int potentiometer = A0;

void setup() {
    pinMode(led, OUTPUT);
    pinMode(button, INPUT_PULLUP);
    Serial.begin(9600);
}

void loop() {
    int potentiometerValue = analogRead(potentiometer);
    int buttonState = digitalRead(button);

    Serial.print(potentiometerValue);
    Serial.print(",");
    Serial.println(buttonState);

    Serial.print(potentiometerValue);
    Serial.print(",");
    Serial.println(buttonState);

    if (Serial.available() > 0) {
        String input = Serial.readStringUntil('\n');
        int brightness = input.toInt();
        
        if (brightness >= 0 && brightness <= 255) {
            analogWrite(led, brightness);
        }
    }
    delay(50);
}
