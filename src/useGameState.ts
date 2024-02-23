import { useEffect, useReducer } from "react";
let tileIdCounter = 0;
type RealTile = {
  value: number;
  key: number;
  coords: { row: number; col: number };
};

type Tile = { value: number; key: number } | null;

type GameData = {
  tiles: RealTile[];
  score: number;
  gameOver: boolean;
};

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
        grid[row][col]?.value === grid[row][col + 1]?.value
      ) {
        //@ts-ignore
        const newTotal = grid[row][col]?.value + grid[row][col + 1].value;
        //@ts-ignore
        grid[row][col].value = newTotal;
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
        grid[row][col]?.value === grid[row][col - 1]?.value
      ) {
        //@ts-ignore
        const newTotal = grid[row][col].value + grid[row][col - 1].value;
        //@ts-ignore
        grid[row][col].value = newTotal;
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
        grid[row][col]?.value === grid[row + 1][col]?.value
      ) {
        //@ts-ignore
        const newTotal = grid[row][col]?.value + grid[row + 1][col]?.value;
        //@ts-ignore
        grid[row][col].value = newTotal;
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
  debugger;
  for (let col = 0; col < grid.length; col++) {
    for (let row = grid.length - 1; row > 0; row--) {
      if (
        grid[row][col] &&
        grid[row - 1][col] &&
        grid[row][col]?.value === grid[row - 1][col]?.value
      ) {
        //@ts-ignore
        const newTotal = grid[row][col]?.value + grid[row - 1][col]?.value;
        //@ts-ignore
        grid[row][col].value = newTotal;
        score += newTotal;
        grid[row - 1][col] = null;
      }
    }
  }
  return { grid, score, gameOver };
};

const generateNewTileCoords = (grid: Tile[][]) => {
  let available: { row: number; col: number }[] = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid.length; col++) {
      if (grid[row][col] === null) {
        available.push({ row, col });
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
      if (
        col + 1 < grid[row].length &&
        grid[row][col]?.value === grid[row][col + 1]?.value
      ) {
        return { open, gameOver: false };
      }
      if (
        row + 1 < grid.length &&
        grid[row][col]?.value === grid[row + 1][col]?.value
      ) {
        return { open, gameOver: false };
      }
    }
  }

  return { open, gameOver: true };
};
const checkGridChange = (initial: Tile[][], changed: Tile[][]) => {
  debugger;
  for (let row = 0; row < initial.length; row++) {
    for (let col = 0; col < initial[row].length; col++) {
      const i = initial[row][col];
      const n = changed[row][col];
      if (i === null && n !== null) {
        return true;
      }
      if (i && n && i.value !== n.value) {
        return true;
      }
    }
  }
  return false;
};
const gameReducer = (state: GameState, action: GameAction) => {
  // Make Sure not to mutate the state so that the reducer is pure
  const stateCopy: GameState = {
    gameOver: state.gameOver,
    score: state.score,
    grid: state.grid.map((row) =>
      row.map((val) => {
        return val ? { value: val.value, key: val.key } : null;
      }),
    ),
  };
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
  // move and combine the tiles
  const { grid, score } = moveFunc(combineFunc(moveFunc(stateCopy)));
  const { open, gameOver } = checkForGameOver(grid);
  const gridChange = checkGridChange(state.grid, grid);
  // check that the move was valid, and there is an open space to insert a new tile
  if (gridChange && open > 0) {
    const newCoords = generateNewTileCoords(grid);
    grid[newCoords.row][newCoords.col] = {
      value: Math.random() > 0.9 ? 4 : 2,
      key: tileIdCounter,
    };
    tileIdCounter += 1;
  }

  return {
    grid,
    score,
    gameOver,
  };
};

const randomTile = () => ({
  row: Math.floor(Math.random() * 4),
  col: Math.floor(Math.random() * 4),
});
const generateInitialBoard = () => {
  let grid: Tile[][] = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
  let first = randomTile();
  let second = randomTile();
  while (first.row === second.row && first.col === second.col) {
    second = randomTile();
  }
  grid[first.row][first.col] = {
    value: 2,
    key: tileIdCounter,
  };
  tileIdCounter += 1;
  grid[second.row][second.col] = {
    value: 2,
    key: tileIdCounter,
  };
  return grid;
};
const createInitialState = () => {
  return {
    grid: generateInitialBoard(),
    score: 0,
    gameOver: false,
  };
};

type UseGameStateType = () => GameData;
const sortTiles = (a: RealTile, b: RealTile) => a.key - b.key;
export const useGameState: UseGameStateType = () => {
  const [{ gameOver, grid, score }, dispatch] = useReducer(
    gameReducer,
    null,
    createInitialState,
  );
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

  const tiles: RealTile[] = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const t = grid[row][col];
      if (t === null) {
        continue;
      } else {
        tiles.push({
          value: t.value,
          key: t.key,
          coords: { row, col },
        });
      }
    }
  }
  tiles.sort(sortTiles);
  return {
    tiles,
    gameOver,
    score,
  };
};
