import { useGameState } from "./useGameState";

function App() {
  const { grid, score, gameOver } = useGameState();
  return (
    <>
      <p>Score: {score}</p>
      <p>Game Over: {gameOver}</p>
      <div className="grid h-96 w-96 grid-cols-4 justify-items-center justify-items-stretch gap-1 bg-black text-center">
        {grid.map((row) =>
          row.map((value) => <div className="bg-slate-500">{value}</div>),
        )}
        {/* <div className="bg-slate-500">1</div>
        <div className="bg-slate-500">2</div>
        <div className="bg-slate-500">3</div>
        <div className="bg-slate-500">4</div>
        <div className="bg-slate-500">5</div>
        <div className="bg-slate-500">6</div>
        <div className="bg-slate-500">7</div>
        <div className="bg-slate-500">8</div>
        <div className="bg-slate-500">9</div> */}
      </div>
    </>
  );
}

export default App;
