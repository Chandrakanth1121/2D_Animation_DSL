How to Run

1. Start the Server

  Run the provided shell script to start a local server:

  ./start-server.sh

  This script will host the project on a local server.


2. Open in a Browser

  After running the server, open your browser and navigate to:

  http://127.0.0.1:8080


3. Interact with the DSL

    Write DSL scripts in the text area provided in the user interface.
    Execute the scripts to visualize animations on the HTML5 canvas.



Starter Code Example:

The following script demonstrates the key features of the DSL:

h = obj.create(100, 100, 0s, human);
h.move(+50, +50, 2s);
Loop(3, h, 2s) {
  h.move(-30, +20, 1s);
  h.move(+30, -20, 1s);
}
if(h.x > 100) {
  h.move(+50, -20, 2s);
}
else {
  h.move(-50, +20, 2s);
}
c = obj.create(200, 150, 0s, car);
c.move(+600, +0, 6s);


Explanation:
    Object Creation: Creates two objects, h (human) and c (car), at specific positions with initial settings.
    Movement: Moves objects relative to their current positions over a defined time.
    Loops: Repeats a series of movements three times, creating a zigzag motion for h.
    Conditionals: Executes different movements based on the position of h.

Use this script as a starting point to explore the DSL's capabilities.