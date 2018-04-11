function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function newGame() {
  return new Game();
}

function shuffle(array) {
  let m = array.length;
  while(m) {
    let i = Math.floor(Math.random() * m--);
    let t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(number) {
  if(number < 1 || number > 100 || typeof number !== 'number' || isNaN(number)) {
    var error =  "That is an invalid guess.";
    $('#title').text(error);
    throw error;
  }
  this.playersGuess = number;
  return this.checkGuess();
};

Game.prototype.checkGuess = function() {
  if(this.playersGuess === this.winningNumber) {
    $('#hint, #submit').prop("disabled",true);
    $('#subtitle').text("Press the Reset button to play again!");
    return 'You Win!';
  } else if(this.pastGuesses.includes(this.playersGuess)) {
    return 'You have already guessed that number.';
  } else {
    this.pastGuesses.push(this.playersGuess);
    $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
    if(this.pastGuesses.length === 5) {
      $('#hint, #submit').prop("disabled",true);
      $('#subtitle').text("Press the Reset button to play again!");
      return 'You Lose.';
    }
  }
  if(this.isLower()) {
    $('#subtitle').text("Guess Higher!");
  } else {
    $('#subtitle').text("Guess Lower!");
  }

  if(this.difference() < 10) {
    return "You're burning up!";
  } else if (this.difference() >= 10 && this.difference() < 25) {
    return "You're lukewarm.";
  } else if (this.difference() >= 25 && this.difference() < 50) {
    return "You're a bit chilly.";
  } else if (this.difference() >= 50) {
    return "You're ice cold!";
  }
};

Game.prototype.provideHint = function() {
  return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
};

function makeAGuess(game) {
    var guess = $('#players-input').val();
    $('#players-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#title').text(output);
}

$(document).ready(function() {
  var game = new Game();
  var counter = 0;

  $('#submit').click(function(e) {
     makeAGuess(game);
  });

  $('#players-input').keypress(function(event) {
    if ( event.which === 13 ) {
      makeAGuess(game);
    }
  });

  $('#hint').click(function() {
    counter++;
    var hints = game.provideHint();
    $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    $('#hint-count').text(3 - counter)
    if(counter === 3) {
      $('#hint').prop("disabled", true);
    }
  });

  $('#reset').click(function() {
    game = newGame();
    counter = 0
    $('#title').text('Play the Guessing Game!');
    $('#subtitle').text('Guess a number between 1-100!');
    $('.guess').text('-');
    $('#hint, #submit').prop("disabled",false);
  });

});
