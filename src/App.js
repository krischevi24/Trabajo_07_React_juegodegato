
import React from 'react';
import './App.css';
import Square from './components/square';
import Tablero from './components/tablero';
import {useState, useEffect} from 'react';

const defaultSquares = () => (new Array(9)).fill(null);

const lines = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6],
];

function App() {
  const [squares, setSquares] = useState(defaultSquares());
  const [winner, setWinner] = useState(null);
  useEffect(() => {
    const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;
    const linesthatAre = (a,b,c) => {
      return lines.filter(squareIndexes => {
        const squareValues = squareIndexes.map(index => squares[index]);
        return JSON.stringify([a,b,c].sort()) === JSON.stringify(squareValues.sort());
      });
    };

    const emptyIndexes = squares
      .map((square, index) => square === null ? index : null)
      .filter(val => val !== null);

    const playerwon = linesthatAre('x','x','x').length > 0;
    const computerwon = linesthatAre('o','o','o').length > 0;
    if (playerwon){
      setWinner('x');
    }
    if (computerwon){
      setWinner('o');
    }
    const putComputerAt = index => {
      let newSquares = squares;
      newSquares[index] = 'o';
      setSquares([...newSquares]);
    };
    if (isComputerTurn){
      const wininglines = linesthatAre('o', 'o', null);
      if (wininglines.length > 0){
          const winIndex = wininglines[0].filter(index => squares[index] === null)[0];
          putComputerAt(winIndex);
          return;
      }

      const linestoblock = linesthatAre('x','x',null);
      if(linestoblock.length > 0){
        const blockIndex = linestoblock[0].filter(index => squares[index] === null)[0];
        putComputerAt(blockIndex);
        return;
      }

      const linestoContinue = linesthatAre('o', null, null);
      if(linestoContinue.length > 0){
        putComputerAt(linestoContinue[0].filter(index => squares[index] === null)[0]);
        return;
      }


      const randomIndex = emptyIndexes[Math.ceil(Math.random()*emptyIndexes.length)];
      putComputerAt(randomIndex);
    }
  })

  function handleSquareClick(index){
    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;
    if (isPlayerTurn){
      let newSquares = squares;
      newSquares[index] = 'x';
      setSquares([...newSquares]);
    }
  }

  return (
    <main>
      <Tablero>
        {squares.map((square, index) => 
        <Square 
        x={square==='x'?1:0}
        o={square==='o'?1:0}
        onClick={() => handleSquareClick(index)} />
        )}
      </Tablero>
      {!!winner && winner === 'x' && (
        <div className="Resultado: green">
         Tu Ganaste!
        </div>
      )}
      {!!winner && winner === 'o' && (
        <div className="Resultado: red">
         Perdiste
        </div>
      )}
    </main>
  );
}

export default App;
