import { useGameState } from "./useGameState";

function App() {
  const { tiles, score, gameOver } = useGameState();

  return (
    <>
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
            <div className="absolute h-96 w-96" style={{ transition: "100ms" }}>
              {tiles.map((tile) => (
                <div
                  key={tile.key}
                  className={`absolute h-[5.5rem] w-[5.5rem] overflow-hidden bg-slate-500 tile-${tile.value} pos-${tile.coords.row}-${tile.coords.col}`}
                  style={{ transition: "100ms" }}
                >
                  {tile.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
