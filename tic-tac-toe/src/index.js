import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


//why is this a function and not a class, again?
function Square(props) {
  //what is props.onClick()??
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {


  render() {

    function renderRow(props, range) {
      function renderSquare(i) {
        return <Square
          key={i}
          value={props.squaresState[i]}
          onClick={() => props.onClick(i)}
        />;
      }
      return range.map(
        function (index) {
          return renderSquare(index);
        }
      );
    }

    return (
      <div>
        <div className="board-row">
          {renderRow(this.props, [0, 1, 2])}
        </div>
        <div className="board-row">
          {renderRow(this.props, [3, 4, 5])}
        </div>
        <div className="board-row">
          {renderRow(this.props, [6, 7, 8])}
        </div>
      </div>
    );
  }

}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squaresStateArray: Array(9).fill(null)
        }
      ],
      xIsNext: true,
      stepNumber: 0
    };
  }

  handleClick(i) {
    //slice() creates a copy
    const history = this.state.history;
    const currentMove = history[history.length - 1]
    const currentMoveSquares = currentMove.squaresStateArray.slice();
    const previouslyClicked = currentMoveSquares[i];
    const someoneHasWon = calculateWinner(currentMoveSquares);
    if (!someoneHasWon && !previouslyClicked) {
      currentMoveSquares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squaresStateArray: currentMoveSquares,
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length
      });
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const allHistory = this.state.history;
    const currentMove = allHistory[this.state.stepNumber];
    const winner = calculateWinner(currentMove.squaresStateArray);
    const isGameOver = (this.state.stepNumber === 9);

    const moves = allHistory.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });


    let status;
    if (winner) {
      status = 'Congrats, the winner is:' + winner;
    }
    else if(isGameOver){
      status = 'Game over - stalemate!'
    }
    else {
      status = 'Next Player is: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squaresState={currentMove.squaresStateArray}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);

//why does this need the function keyword?
function calculateWinner(boardSquares) {
  //todo: refactor this!...and cover with tests
  const winningLines = [
    [0, 1, 2], //top line
    [3, 4, 5], //middle line
    [6, 7, 8], //bottom line
    [0, 3, 6], //top left vertical down
    [1, 4, 7], //top middle vertical down
    [2, 5, 8], //top right vertical down
    [0, 4, 8], //top left to bottom right diagonal
    [2, 4, 6], //top right to bottom left diagonal
  ];
  for (let i = 0; i < winningLines.length; i++) {
    const [a, b, c] = winningLines[i];
    if (boardSquares[a] && boardSquares[a] === boardSquares[b] && boardSquares[a] === boardSquares[c]) {
      return boardSquares[a];
    }
  }
  return null;
}
