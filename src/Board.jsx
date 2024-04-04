import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.2 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    for (let i = 0; i < nrows; i++) {
      let row = [];
      for (let j = 0; j < ncols; j++) {
        row.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(row);
    }

    return initialBoard;
  }


  function hasWon() {
    const checkBoard = board.every(row => row.every(cell => cell === false));
    return checkBoard;
  }

  // needs to take in "y-x";
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // const newBoard = structuredClone(oldBoard);
      const newBoard = oldBoard.map(row => [...row]);

      flipCell(y, x, newBoard);
      flipCell(y + 1, x, newBoard);
      flipCell(y - 1, x, newBoard);
      flipCell(y, x + 1, newBoard);
      flipCell(y, x - 1, newBoard);

      return newBoard;
    });
  }


  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <div className="win-msg">You win!</div>;
  }

  function generateTableBody() {
    let tableBody = [];

    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        const coord = `${y}-${x}`;

        row.push(<Cell
          key={coord}
          flipCellsAroundMe={() => flipCellsAround(coord)}
          isLit={board[y][x]}
        />);
      }
      tableBody.push(<tr key={y}>{row}</tr>);
    }

    return tableBody;
  }

  return (
    <div className="Board">
      <table className="Board-table">
        <tbody>{generateTableBody()}</tbody>
      </table>
    </div>
  );
}

export default Board;
