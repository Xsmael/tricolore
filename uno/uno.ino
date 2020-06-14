          //pH meter Analog output to Arduino Analog Input 0
#define Offset 0.00            //deviation compensate
#define LED 13
#define RED 0
#define ORANGE 1
#define GREEN 2
int T1[] = {2, 3, 4};
int T2[] = {5, 6, 7};
int T3[] = {8, 9, 10};
int T4[] = {11, 12, 13};

// the setup function runs once when you press reset or power the board
void setup() {

  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED, OUTPUT);
  for ( int i = 2; i <= 13 ; i++ )
    pinMode(i, OUTPUT);
    
  Serial.begin(9600); // Initialize serial communications with the PC
//  while (!Serial);    // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)
 
}

// the loop function runs over and over again forever
void loop() {
      Serial.print("CONTROLLER READY");
      Serial.println();
      delay(500);
}


void changeLightState(int T[], char state){
      switch (state) {
        case 'G': 
          digitalWrite(T[RED],0);
          digitalWrite(T[ORANGE],0);        
          digitalWrite(T[GREEN],1);
        break;
        case 'R': 
          digitalWrite(T[GREEN],0);
          digitalWrite(T[ORANGE],0);        
          digitalWrite(T[RED],1);
        break;
        case 'O':         
          digitalWrite(T[RED],0);        
          digitalWrite(T[GREEN],0);
          digitalWrite(T[ORANGE],1);
        break;
      }
}
void serialEvent(){
    if(Serial.available()) {
                // read the incoming byte:
            String raw = Serial.readString();
            for ( int j = 0; j < 4 ; j++ ) {
              
            String str = getValue(raw, ':', j);
            Serial.println(str);
            String T= str.substring(0, 2);
            int delimiter= str.indexOf('#');
            
            char S= str.charAt(delimiter+1);

             switch(T.substring(1).toInt()) {
                case 1: changeLightState(T1,S); break;
                case 2: changeLightState(T2,S); break;
                case 3: changeLightState(T3,S); break;
                case 4: changeLightState(T4,S); break;
             }
            // debug
            }
        }
}

String getValue(String data, char separator, int index)
{
    int found = 0;
    int strIndex[] = { 0, -1 };
    int maxIndex = data.length() - 1;

    for (int i = 0; i <= maxIndex && found <= index; i++) {
        if (data.charAt(i) == separator || i == maxIndex) {
            found++;
            strIndex[0] = strIndex[1] + 1;
            strIndex[1] = (i == maxIndex) ? i+1 : i;
        }
    }
    return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}
