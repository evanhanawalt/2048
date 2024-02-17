import { useGameState } from "./useGameState";

function App() {
  const { grid, score, gameOver } = useGameState();
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
            <div
              className="absolute grid  h-96 w-96 auto-rows-[1fr]  grid-cols-4 gap-2"
              style={{ transition: "100ms" }}
            >
              {grid.map((row, rowI) =>
                row.map((value, colI) => (
                  <div
                    key={rowI * 4 + colI}
                    className={`overflow-hidden ${value ? "bg-slate-500" : "bg-transparent"}`}
                    style={{ transition: "100ms" }}
                  >
                    {value}
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
