const BAUD_RATE = 9600; // match with Arduino's baud rate

let port, connectBtn; // declare global variables
let buttonState = 1; // store button state 
let lastButtonState = 1; // store last button state
let potValue = 0; // store potentiometer value 
let bgColor; // default background color
let baseColor;
let lightLevel = 512;   

function setup() {
    setupSerial(); // run serial setup function
  
    // create full-screen canvas
    createCanvas(windowWidth, windowHeight);
    bgColor = color(100, 150, 200); // Initial background color (solid blue)
    baseColor = color(100, 150, 200); // Store base color for brightness changes
  
    // p5 text settings
    textFont("system-ui", 30);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    
    // create the connect button
    connectBtn = createButton("Connect to Arduino");
    connectBtn.position(20, 20);
    connectBtn.mousePressed(onConnectButtonClicked);
  }

function draw() {
    const portIsOpen = checkPort(); // Check if the port is open
    if (!portIsOpen) return; // If not, exit the loop
  
    let str = port.readUntil("\n"); // Read serial data until newline
    if (str.length == 0) return; // If no data is received, return
  
    let values = str.trim().split(","); // Split incoming data by commas
    if (values.length === 2) {
      lightLevel = int(values[0]); // First value: Photoresistor reading
      buttonState = int(values[1]); // Second value: Button state (0 = pressed, 1 = not pressed)
    }
  
    //Detect button press transition (change color only when button is pressed (1->0))
    if (buttonState === 0 && lastButtonState === 1) {
      baseColor = color(random(255), random(255), random(255)); // Assign a new random color
    }
  
    lastButtonState = buttonState; // Update the previous button state
  
    // adjust background brightness based on photoresistor value
    let newR = map(lightLevel, 200, 1023, 0, red(baseColor)); // Adjust red brightness
    let newG = map(lightLevel, 200, 1023, 0, green(baseColor)); // Adjust green brightness
    let newB = map(lightLevel, 200, 1023, 0, blue(baseColor)); // Adjust blue brightness
    bgColor = color(newR, newG, anewB); // Apply brightness change for all
  
    background(bgColor); // Set the new background color
  
    //Display instructions
    fill(255 - newR, 255 - newG, 255 - newB); // Inverted text color
    textSize(24);
    textAlign(CENTER);
    text("Press the button to change background color!", width / 2, height / 2);
    text("Cover/uncover the photoresistor to adjust brightness!", width / 2, height * 0.7);
    text("Move the mouse to control LED brightness!", width / 2, height * 0.85);
  
    //LED brightness based on mouse position on screen
    let ledBrightness = map(mouseX, 0, width, 0, 255);
    ledBrightness = constrain(ledBrightness, 0, 255);
    port.write(ledBrightness + "\n"); //Send to Arduino
  }
  

// serial setup function
function setupSerial() {
  port = createSerial();
  
  // check previously used ports
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], BAUD_RATE);
  }
}

// check if serial port is open 
function checkPort() {
  if (!port.opened()) {
    connectBtn.html("Connect to Arduino");
    background("gray"); // grey background if not connected
    return false;
  } else {
    connectBtn.html("Disconnect");
    return true;
  }
}

// handle button connection click 
function onConnectButtonClicked() {
  if (!port.opened()) {
    port.open(BAUD_RATE); // open serial connection 
  } else {
    port.close(); // close connection 
  }
}