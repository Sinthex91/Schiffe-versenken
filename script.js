/*
MODEL
*/
let model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [
    {
      locations: [0, 0, 0],
      hits: ["", "", ""]
    },
    {
      locations: [0, 0, 0],
      hits: ["", "", ""]
    },
    {
      locations: [0, 0, 0],
      hits: ["", "", ""]
    }
  ],

  fire: function(guess) {
    for (i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      let index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("TREFFER!");
        if (this.isSunk(ship)) {
          view.displayMessage("Schiff versenkt!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("Leider daneben.");
    return false;
  },

  isSunk: function(ship) {
    for (i = 0; i < this.numShips; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },

  generateShipLocations: function() {
    let locations;
    for (let i = 0; i < this.numShips; i++) {
      console.log(i);
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
    console.log("Ships array: ");
    console.log(this.ships);
  },

  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;

    if (direction === 1) {
      //Horizontal ausgerichtetes Schiff
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * this.boardSize - this.shipLength);
    } else {
      //Vertikal ausgerichtetes Schiff
      row = Math.floor(Math.random() * this.boardSize - this.shipLength);
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocation = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        //Horizontal ausgerichtetes Schiff
        newShipLocation.push(row + "" + (col + i));
      } else {
        //Vertikal ausgerichtetes Schiff
        newShipLocation.push(row + i + "" + col);
      }
    }
    return newShipLocation;
  },

  collision: function(locations) {
    for (i = 0; i < this.numShips; i++) {
      let ship = model.ships[i];
      for (j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
};

/*
VIEW
*/
let view = {
  displayMessage: function(msg) {
    let message = document.getElementById("message");
    message.innerHTML = msg;
  },
  displayHit: function(location) {
    let cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function(location) {
    let cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

/*
CONTROLLER
*/
let controller = {
  guesses: 0,

  processGuess: function(guess) {
    let location = this.parseGuess(guess);
    if (location) {
      this.guesses++;
      let hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(
          "Sie haben mit " + this.guesses + " Versuchen alle Schiffe versenkt."
        );
      }
    }
  },

  parseGuess: function(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
      alert(
        "Bitte geben Sie einen Buchstaben und eine Zahl des Spielfeldes ein."
      );
    } else {
      let firstChar = guess.charAt(0);
      let row = alphabet.indexOf(firstChar);
      let column = guess.charAt(1);

      if (isNaN(row) || isNaN(column)) {
        alert("Hoppla, das ist nicht auf dem Spielfeld.");
      } else if (
        row < 0 ||
        row >= model.boardSize ||
        column < 0 ||
        column >= model.boardSize
      ) {
        alert("Hoppla, das ist nicht auf dem Spielfeld.");
      } else {
        return row + column;
      }
    }
    return null;
  }
};

function handleKeyPress(e) {
  let fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}
function handleFireButton() {
  let guessInput = document.getElementById("guessInput");
  let guess = guessInput.value.toUpperCase();

  controller.processGuess(guess);

  guessInput.value = "";
}

window.onload = init;

function init() {
  let fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}
