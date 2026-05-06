'use client';

import { useState } from 'react';

function Square({ value, onSquareClick }: { value: string | null; onSquareClick: () => void }) {
  return (
    <button
      onClick={onSquareClick}
      style={{
        width: 60, height: 60, fontSize: 28, fontWeight: 'bold',
        border: '1px solid #999', backgroundColor: '#fff', cursor: 'pointer',
        margin: '-1px 0 0 -1px',
      }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }: { xIsNext: boolean; squares: (string | null)[]; onPlay: (nextSquares: (string | null)[]) => void }) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div>
      <div style={{ marginBottom: 20, fontSize: 20, fontWeight: 'bold' }}>{status}</div>
      {[0, 3, 6].map(row => (
        <div key={row} style={{ display: 'flex' }}>
          {[0, 1, 2].map(col => {
            const i = row + col;
            return <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />;
          })}
        </div>
      ))}
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => (
    <li key={move}>
      <button onClick={() => jumpTo(move)} style={{ padding: '5px 10px', margin: 2, fontSize: 14, cursor: 'pointer' }}>
        {move === 0 ? 'Go to game start' : `Go to move #${move}`}
      </button>
    </li>
  ));

  return (
    <div style={{ display: 'flex', gap: 40, background: 'white', padding: 30, borderRadius: 16, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <div><Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} /></div>
      <div><h2>Game History</h2><ol style={{ paddingLeft: 20 }}>{moves}</ol></div>
    </div>
  );
}

function calculateWinner(squares: (string | null)[]) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
}

export default function Home() {
  return (
    <main style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', margin: 0, backgroundColor: '#f0f0f0',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <Game />
    </main>
  );
}
