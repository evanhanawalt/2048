import React, { useEffect, useReducer } from "react";

type Tile = null | number;

type GameState = {
  grid: Tile[][];
  score: number;
  gameOver: boolean;
};

type GameStateFunction = (grid: GameState) => GameState;

export enum GameActionKind {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}
export interface GameAction {
  type: GameActionKind;
}

const moveRight: GameStateFunction = ({ grid, score, gameOver }: GameState) => {
  let result: Tile[][] = [];
  for (let i = 0; i < grid.length; i++) {
    const filteredRow = grid[i].filter((value) => value);
    const nullFill = Array(4 - filteredRow.length).fill(null);
    const newRow = nullFill.concat(filteredRow);
    result.push(newRow);
  }
  return { grid: result, score, gameOver };
};

const moveLeft: GameStateFunction = ({ grid, score, gameOver }: GameState) => {
  let result: Tile[][] = [];
  for (let i = 0; i < grid.length; i++) {
    const filteredRow = grid[i].filter((value) => value);
    const nullFill = Array(4 - filteredRow.length).fill(null);
    const newRow = filteredRow.concat(nullFill);
    result.push(newRow);
  }
  return { grid: result, score, gameOver };
};

const moveUp: GameStateFunction = ({ grid, score, gameOver }: GameState) => {
  let result: Tile[][] = [[], [], [], []];
  for (let col = 0; col < grid.length; col++) {
    const values = [grid[0][col], grid[1][col], grid[2][col], grid[3][col]];
    const filteredCol = values.filter((value) => value);
    const nullFill = Array(4 - filteredCol.length).fill(null);
    const newCol = filteredCol.concat(nullFill);
    result[0][col] = newCol[0];
    result[1][col] = newCol[1];
    result[2][col] = newCol[2];
    result[3][col] = newCol[3];
  }
  return { grid: result, score, gameOver };
};

const moveDown: GameStateFunction = ({ grid, score, gameOver }: GameState) => {
  let result: Tile[][] = [[], [], [], []];
  for (let col = 0; col < grid.length; col++) {
    const values = [grid[0][col], grid[1][col], grid[2][col], grid[3][col]];
    const filteredCol = values.filter((value) => value);
    const nullFill = Array(4 - filteredCol.length).fill(null);
    const newCol = nullFill.concat(filteredCol);
    result[0][col] = newCol[0];
    result[1][col] = newCol[1];
    result[2][col] = newCol[2];
    result[3][col] = newCol[3];
  }
  return { grid: result, score, gameOver };
};
const combineLeft: GameStateFunction = ({
  grid,
  score,
  gameOver,
}: GameState) => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length - 1; col++) {
      if (
        grid[row][col] &&
        grid[row][col + 1] &&
        grid[row][col] === grid[row][col + 1]
      ) {
        //@ts-ignore
        const newTotal = grid[row][col] + grid[row][col + 1];
        grid[row][col] = newTotal;
        score += newTotal;
        grid[row][col + 1] = null;
      }
    }
  }
  return { grid, score, gameOver };
};

const combineRight: GameStateFunction = ({
  grid,
  score,
  gameOver,
}: GameState) => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = grid[row].length - 1; col > 0; col--) {
      if (
        grid[row][col] &&
        grid[row][col - 1] &&
        grid[row][col] === grid[row][col - 1]
      ) {
        //@ts-ignore
        const newTotal = grid[row][col] + grid[row][col - 1];
        grid[row][col] = newTotal;
        score += newTotal;
        grid[row][col - 1] = null;
      }
    }
  }
  return { grid, score, gameOver };
};

const combineUp: GameStateFunction = ({ grid, score, gameOver }: GameState) => {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid.length - 1; row++) {
      if (
        grid[row][col] &&
        grid[row + 1][col] &&
        grid[row][col] === grid[row + 1][col]
      ) {
        //@ts-ignore
        const newTotal = grid[row][col] + grid[row + 1][col];
        grid[row][col] = newTotal;
        score += newTotal;
        grid[row + 1][col] = null;
      }
    }
  }
  return { grid, score, gameOver };
};

const combineDown: GameStateFunction = ({
  grid,
  score,
  gameOver,
}: GameState) => {
  for (let col = 0; col < grid.length; col++) {
    for (let row = grid.length - 1; row > 0; row--) {
      if (
        grid[row][col] &&
        grid[row - 1][col] &&
        grid[row][col] === grid[row - 1][col]
      ) {
        //@ts-ignore
        const newTotal = grid[row][col] + grid[row - 1][col];
        grid[row][col] = newTotal;
        score += newTotal;
        grid[row - 1][col] = null;
      }
    }
  }
  return { grid, score, gameOver };
};

const generateNewTileCoords = (grid: Tile[][]) => {
  let available: [number, number][] = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid.length; col++) {
      if (grid[row][col] === null) {
        available.push([row, col]);
      }
    }
  }
  return available[Math.floor(available.length * Math.random())];
};

const checkForGameOver = (grid: Tile[][]) => {
  let open = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid.length; col++) {
      if (grid[row][col] === null) {
        open += 1;
      }
    }
  }

  if (open > 0) {
    return { open, gameOver: false };
  }
  // No open spaces on the grid
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      // check for adjecent values that can be combined
      if (col + 1 < grid[row].length && grid[row][col] === grid[row][col + 1]) {
        return { open, gameOver: false };
      }
      if (row + 1 < grid.length && grid[row][col] === grid[row + 1][col]) {
        return { open, gameOver: false };
      }
    }
  }

  return { open, gameOver: true };
};

const gameReducer = (state: GameState, action: GameAction) => {
  let moveFunc: GameStateFunction;
  let combineFunc: GameStateFunction;
  switch (action.type) {
    case GameActionKind.DOWN:
      moveFunc = moveDown;
      combineFunc = combineDown;
      break;
    case GameActionKind.UP:
      moveFunc = moveUp;
      combineFunc = combineUp;
      break;
    case GameActionKind.LEFT:
      moveFunc = moveLeft;
      combineFunc = combineLeft;
      break;
    case GameActionKind.RIGHT:
      moveFunc = moveRight;
      combineFunc = combineRight;
      break;
    default:
      throw new Error("Reducer Failed?");
  }
  const { grid, score } = moveFunc(combineFunc(moveFunc(state)));
  const { open, gameOver } = checkForGameOver(grid);

  if (open > 0) {
    const newCoords = generateNewTileCoords(grid);
    grid[newCoords[0]][newCoords[1]] = Math.random() > 0.9 ? 4 : 2;
  }

  return {
    grid,
    score,
    gameOver,
  };
};

const randomTile = () => [
  Math.floor(Math.random() * 4),
  Math.floor(Math.random() * 4),
];
const generateInitialBoard = () => {
  let grid: Tile[][] = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
  let first = randomTile();
  let second = randomTile();
  while (first[0] === second[0] && first[1] === second[1]) {
    second = randomTile();
  }
  grid[first[0]][first[1]] = 2;
  grid[second[0]][second[1]] = 2;
  return grid;
};
type UseGameStateType = () => GameState;

export const useGameState: UseGameStateType = () => {
  const [gameState, dispatch] = useReducer(gameReducer, {
    grid: generateInitialBoard(),
    score: 0,
    gameOver: false,
  });

  useEffect(() => {
    const keyControl = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        dispatch({ type: GameActionKind.LEFT });
      } else if (e.key === "ArrowUp") {
        dispatch({ type: GameActionKind.UP });
      } else if (e.key === "ArrowRight") {
        dispatch({ type: GameActionKind.RIGHT });
      } else if (e.key === "ArrowDown") {
        dispatch({ type: GameActionKind.DOWN });
      }
    };
    document.addEventListener("keyup", keyControl);

    return () => {
      document.removeEventListener("keyup", keyControl);
    };
  }, [dispatch]);

  return gameState;
};
