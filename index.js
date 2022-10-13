var NUMBER_OF_WORDS = 25;
var ROWS = 5;
var COLS = 5;

var TOTAL_AGENTS = 17;
var TOTAL_ASSASSINS = 1;
var TOTAL_STRANGERS = NUMBER_OF_WORDS - TOTAL_AGENTS - TOTAL_ASSASSINS;

var PERSON_TYPES = {
  RED_AGENT: 0,
  BLUE_AGENT: 1,
  STRANGER: 2,
  ASSASSIN: 3
};

function Game(code) {
  this.words = window.WORDS.slice(0);
  this.code = code;
  this.randomizer = new Math.seedrandom(this.code);
  this.selectedWords = [];
  this.people = [];
  this.firstTurn = null;
}

Game.prototype.start = function() {
  console.log('start game:', this.code);

  this.selectedWords = this.selectWords();
  console.log('selectedWords', this.selectedWords);

  this.firstTurn = this.decideFirstTurn();
  console.log('first turn', this.firstTurn);

  this.addPeople();
  this.shufflePeople();
  console.log('people', this.people);
};

Game.prototype.decideFirstTurn = function() {
  if (Math.floor(this.randomizer() * 10) % 2 == 0) {
    return PERSON_TYPES.RED_AGENT;
  } else {
    return PERSON_TYPES.BLUE_AGENT;
  }
};

Game.prototype.addPeople = function() {
  var initialAgentsPerTeamCount = Math.floor(TOTAL_AGENTS / 2);

  this.populate(PERSON_TYPES.RED_AGENT, initialAgentsPerTeamCount);
  this.populate(PERSON_TYPES.BLUE_AGENT, initialAgentsPerTeamCount);
  this.populate(PERSON_TYPES.STRANGER, TOTAL_STRANGERS);
  this.populate(PERSON_TYPES.ASSASSIN, TOTAL_ASSASSINS);

  // The team that has the first turn will have 1 extra agent.
  this.populate(this.firstTurn, 1);
};

Game.prototype.populate = function(type, count){
  for (var i = 1; i <= count; i++) {
    this.people.push(type);
  }
};

Game.prototype.shufflePeople = function() {
  var currentIndex = this.people.length;
  var temp = null,
      newIndex = null;

  while (currentIndex != 0) {
    otherIndex = Math.floor(this.randomizer() * currentIndex);
    currentIndex--;

    // Swap person from currentIndex with otherIndex.
    temp = this.people[currentIndex];
    this.people[currentIndex] = this.people[otherIndex];
    this.people[otherIndex] = temp;
  }
};

Game.prototype.selectWords = function() {
  const result = [];

  for (var i = 0; i < NUMBER_OF_WORDS; i++) {
    var word = this.getRandomWord();
    result.push(word);
  }

  return result;
};

Game.prototype.getRandomWord = function() {
  var index = Math.floor(this.randomizer() * this.words.length);
  var word = this.words[index];

  // Remove from word list.
  if (index >= 0) this.words.splice(index, 1);

  // Try to get another word if no word is found.
  if (!word) return this.getRandomWord();

  return word;
};


function Card(word, person) {
  this.word = word;
  this.person = person;
  this.el = null;
}

Card.prototype.render = function() {
  this.el = document.createElement('div');
  this.el.classList.add('card');
  this.el.classList.add('person-' + this.person);

  var a = document.createElement('a');
  a.href = '#';
  a.innerText = this.word;
  a.onclick = this.onClick.bind(this);

  this.el.append(a);
  return this.el;
};

Card.prototype.onClick = function(e) {
  e.preventDefault();
  console.log('click', this.word);

  this.el.classList.add('revealed');
};


function Table(game) {
  this.game = game;
}

Table.prototype.addCards = function() {
  var count = 0;

  for (var r = 0; r < ROWS; r++) {
    var row = document.createElement('div');
    row.classList.add('row');

    for (var c = 0; c < COLS; c++) {
      var card = new Card(this.game.selectedWords[count], this.game.people[count]);

      count++;
      row.append( card.render() );
    }

    document.body.append(row);
  }
};


function generateGameCode() {
  // 6 digit game code.
  return (Math.random() + 1).toString().substring(2, 8);
};

function startGame(code) {
  var game = new Game(code);
  game.start();

  var table = new Table(game);
  table.addCards();
}

function joinGame(code) {
  console.log('join game!', code);
  startGame(code);
}

function newGame() {
  console.log('new game!');
  var code = generateGameCode();
  startGame(code);
}


// Main screen
window.onload = function() {
  function getCode() {
    return document.getElementById('main-screen').getElementsByTagName('input')[0].value.trim();
  }

  function hideMainScreen() {
    document.getElementById('main-screen').classList.add('hide');
  };

  document.getElementById('join-game').onclick = function(e) {
    e.preventDefault();
    var code = getCode();
    hideMainScreen();
    joinGame(code);
  };

  document.getElementById('new-game').onclick = function(e) {
    e.preventDefault();
    hideMainScreen();
    newGame();
  };
};

