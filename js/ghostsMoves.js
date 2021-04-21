import { DIRECTIONS, OBJECT_TYPE } from './setup';

// Primitive random movement
export function randomMovement(position, direction, objectExists) {
  let dir = direction;
  let nextMovePos = position + dir.movement;

  //Create an array from the directions object keys
  const keys = Object.keys(DIRECTIONS);

  while (
    objectExists(nextMovePos, OBJECT_TYPE.WALL) ||
    objectExists(nextMovePos, OBJECT_TYPE.GHOST)
  ) {
    // Get  a random key from the key array

    const key = keys[Math.floor(Math.random() * keys.length)];

    //Set the next move

    dir = DIRECTIONS[key];
    //Set the nextMove
    nextMovePos = position + dir.movement;
  }
  return { nextMovePos, direction: dir };
}
