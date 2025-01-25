import { lerp } from "./utils.js";

const predefinedImages = {};

function preloadImages() {
  fetch('./images-list.json') // Fetch the JSON file containing the image names
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch image list');
      }
      return response.json(); // Parse the JSON response
    })
    .then((imageNames) => {
        const imagesContainer = document.getElementById('imagesContainer');
      
      // Display image names dynamically
      imageNames.forEach((name) => {
        const imageNameElement = document.createElement('div');
        imageNameElement.textContent = name.split('.')[0]; // Display image name
        imageNameElement.style.margin = '5px';
        imageNameElement.style.padding = '5px';
        imageNameElement.style.border = '1px solid #ccc';
        
        // Add image name to the display container
        imagesContainer.appendChild(imageNameElement);

        // Preload the images
        const img = new Image();
        img.src = `./images/${name}`; // Use the image path from the JSON
        predefinedImages[name.split('.')[0]] = img; // Map the image to its base name (without extension)
      });
      console.log("Images preloaded:", predefinedImages);
    })
    .catch((error) => {
      console.error("Error preloading images:", error);
    });
}

window.addEventListener("load", () => {
  preloadImages(); // Preload all images
  // console.log("Images preloaded:", predefinedImages); // Debug to ensure images are loaded

  const canvas = document.getElementById("animationCanvas");
  const ctx = canvas.getContext("2d");
  const runButton = document.getElementById("runButton");
  const dslInput = document.getElementById("dslInput");
  const timerElement = document.getElementById("timer");

  const objects = {};
  let uploadedImage = null;
  let timerInterval;

  function renderFrame(objects, currentTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for each frame
    for (const objName in objects) {
      const obj = objects[objName];
      if (currentTime >= obj.startTime) {
        const { x, y } = obj.currentPosition(currentTime);
        if (obj.image) {
          ctx.drawImage(obj.image, x, y, 100, 100); // Draw the object's image
        } else {
          ctx.fillStyle = "blue"; // Fallback color
          ctx.fillRect(x, y, 50, 50); // Draw a rectangle as fallback
        }
      }
    }
  }


  function startTimer() {
    const startTime = performance.now();
    timerElement.textContent = `Timer: 0s`; // Initialize with 0 seconds

    timerInterval = setInterval(() => {
      const elapsedTime = (performance.now() - startTime) / 1000; // Convert ms to seconds
      timerElement.textContent = `Timer: ${Math.round(elapsedTime)}s`; // Round to nearest integer
    }, 100); // Update timer every 100ms
  }

  function stopTimer() {
    clearInterval(timerInterval); // Stop the timer interval
    timerElement.textContent += " (Complete)"; // Indicate completion
  }

  function animationLoop(maxTime, startTime) {
    const extendedMaxTime = maxTime + 1;

    function frame() {
      const elapsedTime = (performance.now() - startTime) / 1000; // Convert ms to seconds

      if (elapsedTime < extendedMaxTime) {
        renderFrame(objects, elapsedTime); // Render the animation frame
        requestAnimationFrame(frame); // Continue animation loop
      } else {
        renderFrame(objects, extendedMaxTime); // Render the final frame for the extended duration
        stopTimer(); // Stop the timer
        console.log("Animation complete!");
      }
    }

    frame(); // Start the loop
  }


  function evaluateCondition(condition, objects) {
    const { obj, property, comparator, value } = condition;
    const object = objects[obj];
    if (!object) {
      console.error(`Object ${obj} not found for condition`);
      return false;
    }

    const propValue = object[property];
    switch (comparator) {
      case "==": return propValue == value;
      case "!=": return propValue != value;
      case ">": return propValue > value;
      case "<": return propValue < value;
      case ">=": return propValue >= value;
      case "<=": return propValue <= value;
      default:
        console.error(`Unknown comparator: ${comparator}`);
        return false;
    }
  }

  function executeDSL(actions, objects, startTime = 0) {
    
    for (const action of actions) {
      if (action.type === "movement") {
        executeMovement(action, objects, startTime);
      } else if (action.type === "ifStatement") {
        executeIfStatement(action, objects, startTime);
      } else if (action.type === "loop") {
        executeLoop(action, objects, startTime);
      } else if (action.type === "objectCreation") {
        executeObjectCreation(action, objects, startTime);
      } else if (action.type === "delete") {
        const deleteTime = executeDelete(action, objects, startTime);
        maxTime = Math.max(maxTime, deleteTime);
      } else {
        console.error(`Unknown action type: ${action.type}`);
      }
    }
  }

  function executeObjectCreation(action, objects) {
    const { name, x, y, time, image } = action;
    objects[name] = {
      startTime: time,
      x,
      y,
      image: predefinedImages[image] || null, // Use preloaded image or fallback to null
      moves: [],
      currentPosition: function (currentTime) {
        let lastMove = { x: this.x, y: this.y, time: this.startTime };
        for (const move of this.moves) {
          if (currentTime >= move.time) lastMove = move;
        }

        const nextMove = this.moves.find((m) => m.time > currentTime);
        if (nextMove) {
          const elapsed = currentTime - lastMove.time;
          const duration = nextMove.time - lastMove.time;
          const t = Math.min(elapsed / duration, 1); // Progress ratio
          return {
            x: lerp(lastMove.x, nextMove.x, t),
            y: lerp(lastMove.y, nextMove.y, t),
          };
        }

        return { x: lastMove.x, y: lastMove.y }; // Return last position
      },
    };
    console.log(`Object created: ${name} (${x}, ${y}) at ${time}s with image: ${image}`);
  }

  function executeMovement(action, objects, startTime) {
    const { name, x, y, time } = action;
    const obj = objects[name];
    if (obj) {
      const lastMove = obj.moves[obj.moves.length - 1] || { x: obj.x, y: obj.y, time: obj.startTime };
      const movementEndTime = Math.max(lastMove.time, startTime) + time;

      const newX = Array.isArray(x)
        ? lastMove.x + (x[0] === "-" ? -x[1] : x[1])
        : x;
      const newY = Array.isArray(y)
        ? lastMove.y + (y[0] === "-" ? -y[1] : y[1])
        : y;

      obj.moves.push({ x: newX, y: newY, time: movementEndTime });
      console.log(`Movement for ${name}: ends at ${movementEndTime}s (x: ${newX}, y: ${newY})`);
    }
  }

  function executeDelete(action, objects, startTime) {
    const { name, time } = action;
    const obj = objects[name];
    if (obj) {
      const lastMove = obj.moves[obj.moves.length - 1] || { time: obj.startTime };
      const deleteTime = Math.max(lastMove.time, startTime) + time;

      setTimeout(() => {
        console.log(`Deleting object: ${name} at ${deleteTime}s`);
        delete objects[name];
      }, deleteTime * 1000); // Convert seconds to milliseconds

      return deleteTime;
    } else {
      console.error(`Object ${name} not found for deletion.`);
      return startTime;
    }
  }

  function executeIfStatement(action, objects, startTime) {
    const { condition, actions, actions1 } = action;
    if (evaluateCondition(condition, objects)) {
      console.log(`Condition met: ${JSON.stringify(condition)}`);
      executeDSL(actions, objects, startTime); // Recursively execute nested actions
    } else {
      console.log(`Condition not met: ${JSON.stringify(condition)}`);
      executeDSL(actions1, objects, startTime); // Recursively execute nested actions
    }
  }

// function executeLoop(action, objects, startTime) {
//   const { count, startTime: loopStartTime, actions } = action;

//   for (let i = 0; i < count; i++) {
//     const iterationStartTime = loopStartTime + i * actions.reduce((totalTime, a) => totalTime + (a.time || 0), 0);
//     executeDSL(actions, objects, iterationStartTime); // Recursively execute loop body
//   }
// }

function executeLoop(action, objects, startTime) {
  const { count, obj, startTime: loopStartTime, actions } = action;
  const objInstance = objects[obj];

  if (!objInstance) {
    console.error(`Object ${obj} not found for loop`);
    return;
  }

  // Get the last move or the initial position of the object
  const lastMove =
    objInstance.moves[objInstance.moves.length - 1] || {
      x: objInstance.x,
      y: objInstance.y,
      time: objInstance.startTime,
    };

  // Calculate the relative start time for the loop
  const relativeLoopStartTime = lastMove.time + loopStartTime;

  // Add a movement to keep the object stationary until the relative loop start time
  objInstance.moves.push({
    x: lastMove.x,
    y: lastMove.y,
    time: relativeLoopStartTime,
  });

  console.log(
    `Object ${obj} held at position (${lastMove.x}, ${lastMove.y}) until ${relativeLoopStartTime}s`
  );

  // Iterate for the given loop count
  for (let i = 0; i < count; i++) {
    // Calculate the start time for each iteration relative to the loop start time
    const iterationStartTime = relativeLoopStartTime + i * actions.reduce((totalTime, action) => totalTime + (action.time || 0), 0);

    // Execute all actions in the loop body
    executeDSL(actions, objects, iterationStartTime);
  }
}

  runButton.addEventListener("click", () => {
    const dslScript = dslInput.value;

    try {
      console.log("Parsing DSL Script:", dslScript);
      const ast = dslParser.parse(dslScript);
      console.log("Parsed AST:", ast);

      executeDSL(ast, objects);
      
      let maxTime = 0;
      for (const objName in objects) {
        const obj = objects[objName];
        const lastMoveTime = obj.moves.length > 0 ? obj.moves[obj.moves.length - 1].time : obj.startTime;
        maxTime = Math.max(maxTime, lastMoveTime);
      }

      console.log(`Total animation duration: ${maxTime}s`);

      console.log("Parsed objects:", objects);


      startTimer();
      const startTime = performance.now();
      animationLoop(maxTime, startTime);
    } catch (e) {
      console.error("Failed to parse DSL script:", e.message);
      console.error("DSL Script Content:", dslScript);
    }
  });


});
