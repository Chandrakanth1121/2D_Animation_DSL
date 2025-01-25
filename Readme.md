# 2D Animation DSL

## Overview
The **2D Animation DSL** is a Domain-Specific Language (DSL) designed to simplify the creation of 2D animations. It provides an intuitive, human-readable syntax to create, animate, and control objects on an HTML5 canvas. With support for object creation, movement, loops, and conditionals, the DSL bridges the gap between complex animation frameworks and beginner-friendly tools.

This project is ideal for developers and designers looking for a lightweight, accessible solution to prototyping animations.

---

## Features
- **Object Creation**: Define objects with initial positions and assets (e.g., images).
- **Object Movement**: Animate objects smoothly with customizable durations.
- **Conditionals**: Logic-driven animations based on runtime conditions.
- **Loops**: Repeat sequences of animations for dynamic effects.
- **Real-Time Visualization**: Render animations on an HTML5 canvas in the browser.
- **Extensible Architecture**: Add custom commands, assets, and runtime behaviors.

---

```dsl
h = obj.create(100, 100, 0s, human);
h.move(+50, +50, 2s);
Loop(3, h, 2s) {
  h.move(-30, +20, 1s);
  h.move(+30, -20, 1s);
}
if(h.x > 100) {
  h.move(+50, -20, 2s);
} else {
  h.move(-50, +20, 2s);
}
c = obj.create(200, 150, 0s, car);
c.move(+600, +0, 6s);

```

This script demonstrates object creation, movement, looping, and conditionals.

* * * * *

Getting Started
---------------

### Prerequisites

-   **Node.js** (for local server setup)

### Installation

1.  Clone the repository:

    ```
    git clone https://github.com/yourusername/2D-Animation-DSL.git
    cd 2D-Animation-DSL
    ```

2.  Install dependencies (if applicable):

    ```
    npm install
    ```

### Running the Project

1.  Start the server:

    ```
    ./start-server.sh
    ```

    This will update the `images-list.json` and launch a local server.

2.  Open the browser and navigate to:

    ```
    http://127.0.0.1:8080
    ```

3.  Write DSL scripts in the provided textarea and click **Run Script** to visualize animations.

* * * * *

Project Structure
-----------------

```
2D_Animation_DSL
├───dsl.pegjs
├───dslParser.js
├───images-list.json
├───index.html
├───Readme.md
├───start-server.sh
├───update-images-list.sh
│
├───css
│   ├───styles.css
│
├───images
│   ├───bus.png
│   ├───car.png
│   ├───cycle.png
│   ├───human.png
│   ├───tree.png
│
└───js
    ├───script.js
    ├───utils.js

```

* * * * *

Usage
-----

### DSL Syntax

#### 1\. **Object Creation**

```
h = obj.create(x, y, time, image);

```

-   **x, y**: Initial position of the object.
-   **time**: Start time for object appearance.
-   **image**: Name of the asset from `images-list.json`.

#### 2\. **Movement**

```
h.move(x, y, time);

```

-   Moves the object relative to its current position over the specified time.

#### 3\. **Loops**

```
Loop(count, obj, startTime) {
  obj.move(x, y, time);
}

```

-   Repeats the actions in the block for the specified count.

#### 4\. **Conditionals**

```
if(obj.property > value) {
  obj.move(x, y, time);
} else {
  obj.move(x, y, time);
}

```

-   Executes different actions based on object properties.

* * * * *

Extending the DSL
-----------------

The modular design makes it easy to:

-   Add new grammar rules in `dsl.pegjs`.
-   Enhance runtime behaviors in `script.js`.
-   Extend assets by adding images to the `images/` directory.

Run `./update-images-list.sh` to refresh the asset list.

* * * * *

Future Work
-----------

-   **Advanced Features**: Keyframes, easing functions, rotations.
-   **Visual Debugging**: Tools to inspect animation states.
-   **Optimizations**: Improved handling for larger animations.

* * * * *
