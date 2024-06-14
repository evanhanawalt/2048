import { useEffect, useReducer } from "react";

type RealTile = {
  value: number;
  key: number;
  state: "new" | "merged" | null | undefined;
  coords: { row: number; col: number };
};

type Tile = {
  value: number;
  key: number;
  state: "new" | "merged" | null | undefined;
} | null;

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
let keyCounter = 0;

const getKey = () => {
  keyCounter += 1;
  return keyCounter;
};

const right: GameStateFunction = ({ grid, score, gameOver }: GameState) => {
  let result: Tile[][] = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = grid[row].length - 1; col > 0; col--) {
      if (!grid[row][col]) {
        continue;
      }
      for (let mergeCol = col - 1; mergeCol >= 0; mergeCol--) {
        if (!grid[row][mergeCol]) {
          continue;
        }
        if (grid[row][col]?.value === grid[row][mergeCol]?.value) {
          //@ts-ignore
          const newTotal = grid[row][col]?.value + grid[row][mergeCol].value;
          //@ts-ignore
          grid[row][col].value = newTotal;
          //@ts-ignore
          grid[row][col].state = "merged";
          score += newTotal;
          grid[row][mergeCol] = null;
        }
        break;
      }
    }
    const filteredRow = grid[row].filter((value) => value);
    const nullFill = Array(4 - filteredRow.length).fill(null);
    const newRow = nullFill.concat(filteredRow);
    result.push(newRow);
  }
  return { grid: result, score, gameOver };
};

const left: GameStateFunction = ({ grid, score, gameOver }: GameState) => {
  let result: Tile[][] = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length - 1; col++) {
      if (!grid[row][col]) {
        continue;
      }
      for (let mergeCol = col + 1; mergeCol < grid[row].length; mergeCol++) {
        if (!grid[row][mergeCol]) {
          continue;
        }

        if (grid[row][col]?.value === grid[row][mergeCol]?.value) {
          //@ts-ignore
          const newTotal = grid[row][col]?.value + grid[row][mergeCol].value;
          //@ts-ignore
          grid[row][col].value = newTotal;
          //@ts-ignore
          grid[row][col].state = "merged";
          score += newTotal;
          grid[row][mergeCol] = null;
        }
        break;
      }
    }

    const filteredRow = grid[row].filter((value) => value);
    const nullFill = Array(4 - filteredRow.length).fill(null);
    const newRow = filteredRow.concat(nullFill);
    result.push(newRow);
  }
  return { grid: result, score, gameOver };
};

const up: GameStateFunction = ({ grid, score, gameOver }: GameState) => {
  let result: Tile[][] = [[], [], [], []];
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid.length - 1; row++) {
      if (!grid[row][col]) {
        continue;
      }
      for (let mergeRow = row + 1; mergeRow < grid.length; mergeRow++) {
        if (!grid[mergeRow][col]) {
          continue;
        }
        if (grid[mergeRow][col]?.value === grid[row][col]?.value) {
          //@ts-ignore
          const newTotal = grid[mergeRow][col]?.value + grid[row][col]?.value;
          //@ts-ignore
          grid[row][col].value = newTotal;
          //@ts-ignore
          grid[row][col].state = "merged";
          score += newTotal;
          grid[mergeRow][col] = null;
        }
        break;
      }
    }
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

const down: GameStateFunction = ({ grid, score, gameOver }: GameState) => {
  let result: Tile[][] = [[], [], [], []];
  for (let col = 0; col < grid.length; col++) {
    // look to combine tiles
    for (let row = grid.length - 1; row > 0; row--) {
      //if this is not a tile, then skip
      if (!grid[row][col]) {
        continue;
      }
      for (let mergeRow = row - 1; mergeRow >= 0; mergeRow--) {
        //if this is not a tile, then skip
        if (!grid[mergeRow][col]) {
          continue;
        }
        // if we find a tile, either merge (match) or break the while loop (nomatch)
        if (grid[mergeRow][col]?.value === grid[row][col]?.value) {
          //@ts-ignore
          const newTotal = grid[mergeRow][col]?.value + grid[row][col]?.value;
          //@ts-ignore
          grid[row][col].value = newTotal;
          //@ts-ignore
          grid[row][col].state = "merged";
          score += newTotal;
          grid[mergeRow][col] = null;
        }
        break;
      }
    }
    //shift this column down in the results
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
        return val ? { value: val.value, key: val.key, state: null } : null;
      }),
    ),
  };
  let stateFunction: GameStateFunction;

  switch (action.type) {
    case GameActionKind.DOWN:
      stateFunction = down;
      break;
    case GameActionKind.UP:
      stateFunction = up;
      break;
    case GameActionKind.LEFT:
      stateFunction = left;
      break;
    case GameActionKind.RIGHT:
      stateFunction = right;
      break;
    default:
      throw new Error("Reducer Failed?");
  }
  // move and combine the tiles
  const { grid, score } = stateFunction(stateCopy);
  const { open, gameOver } = checkForGameOver(grid);
  const gridChange = checkGridChange(state.grid, grid);
  // check that the move was valid, and there is an open space to insert a new tile
  if (gridChange && open > 0) {
    const newCoords = generateNewTileCoords(grid);
    grid[newCoords.row][newCoords.col] = {
      value: Math.random() > 0.9 ? 4 : 2,
      key: getKey(),
      state: "new",
    };
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
    key: getKey(),
    state: "new",
  };
  grid[second.row][second.col] = {
    value: 2,
    key: getKey(),
    state: "new",
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
          state: t.state,
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
