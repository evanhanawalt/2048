import { useGameState } from "./useGameState";

function App() {
  const { tiles, score, gameOver } = useGameState();

  return (
    <main className="flex w-full flex-col items-center bg-black">
      <p>Score: {score}</p>
      <p>Game Over: {gameOver}</p>
      <div className="glow-animation bg-white p-2">
        <div className="grid h-96 w-96 grid-cols-4 gap-2 rounded-lg bg-white text-center">
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="bg-gray-200"></div>
          <div className="absolute h-96 w-96">
            {tiles.map((tile) => (
              <div
                className={`absolute h-[5.5rem] w-[5.5rem] overflow-visible pos-${tile.coords.row}-${tile.coords.col}`}
                key={tile.key}
                style={{
                  transition: "100ms ease-in-out",
                }}
              >
                <div
                  className={`h-full w-full overflow-hidden bg-slate-500 align-middle font-bold shadow-md tile-${tile.value} ${tile.state === "new" ? "tile-new" : ""} ${tile.state === "merged" ? "tile-merged" : ""}`}
                  style={{
                    transition: "100ms ease-in-out",
                    lineHeight: "5.5rem",
                  }}
                >
                  {tile.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
