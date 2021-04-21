import { LEVEL, OBJECT_TYPE } from './setup';
import { randomMovement } from './ghostsMoves';

//classes
import GameBoard from './GameBoard'; //GameBoard
import Pacman from './Pacman'; //pacman
import Ghost from './Ghost'; // ghosts

//sounds
import soundDot from '/sounds/munch.wav';
import soundPellet from '/sounds/pill.wav';
import soundGameStart from '/sounds/game_start.wav';
import soundGameOver from '/sounds/death.wav';
import soundGhost from '/sounds/eat_ghost.wav';

//DOM Elements
const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button');

//Game Constants
const POWER_PELLET_TIME = 10000; //ms
const GLOBAL_SPEED = 80; //ms
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);

//functions

//Audio
const playAudio = audio => {
  const soundEffect = new Audio(audio);
  soundEffect.play();
};

const gameOver = (pacman, grid) => {
  playAudio(soundGameOver);

  document.removeEventListener('keydown', e =>
    pacman.handleKeyInput(e, gameBoard.objectExists)
  );

  gameBoard.showGameStatus(gameWin);

  clearInterval(timer);

  startButton.classList.remove('hide');
};
const checkCollision = (pacman, ghosts) => {
  const collidedGhost = ghosts.find(ghost => pacman.pos === ghost.pos);

  if (collidedGhost) {
    //Pacman eats ghost
    if (pacman.powerPellet) {
      playAudio(soundGhost);

      ghosts.forEach((ghost, i) => {
        if (collidedGhost.name === ghost.name) {
          gameBoard.removeObject(ghost.pos, [
            OBJECT_TYPE.GHOST,
            OBJECT_TYPE.SCARED,
            ghost.name,
          ]);

          //Reset the ghost to the start position

          ghost.pos = ghost.startPos;
        }
      });
      score += 100;
    } else {
      gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
      gameBoard.rotateDiv(pacman.pos, 0);
      gameOver(pacman, gameGrid);
    }
  }
};
const gameLoop = (pacman, ghosts) => {
  gameBoard.moveCharacter(pacman);
  checkCollision(pacman, ghosts);

  ghosts.forEach(ghost => gameBoard.moveCharacter(ghost));
  checkCollision(pacman, ghosts);

  // Check if Pacman eats a dot

  if (gameBoard.objectExists(pacman.pos, OBJECT_TYPE.DOT)) {
    playAudio(soundDot);

    gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
    gameBoard.dotCount--;
    score += 10;
  }

  //check if Pacman eats a powerpellet

  if (gameBoard.objectExists(pacman.pos, OBJECT_TYPE.PELLET)) {
    playAudio(soundPellet);

    gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PELLET]);

    pacman.powerPellet = true;
    score += 50;

    clearTimeout(powerPelletTimer);
    powerPelletTimer = setTimeout(
      () => (pacman.powerPellet = false),
      POWER_PELLET_TIME
    );
  }

  // Change ghost to scare mode  depending on Powerpellet

  if (pacman.powerPellet != powerPelletActive) {
    powerPelletActive = pacman.powerPellet;
    ghosts.forEach(ghost => (ghost.isScared = pacman.powerPellet));
  }

  //Check if all the dots have been eaten

  if (gameBoard.dotCount === 0) {
    gameWin = true;
    gameOver(pacman, ghosts);
  }

  // Show the score
  scoreTable.innerHTML = score;
};

const startGame = () => {
  playAudio(soundGameStart);
  gameWin = false;
  powerPelletActive = false;
  score = 0;

  startButton.classList.add('hide');

  gameBoard.createGrid(LEVEL);

  const pacman = new Pacman(2, 287);
  gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
  document.addEventListener('keydown', e =>
    pacman.handleKeyInput(e, gameBoard.objectExists)
  );

  const ghosts = [
    new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
    new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
    new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
    new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE),
  ];

  timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
};

//Initial setup
let score = 0;
let timer = null;
let gameWin = false;
let powerPelletActive = false;
let powerPelletTimer = null;

//start the game

startButton.addEventListener('click', startGame);
