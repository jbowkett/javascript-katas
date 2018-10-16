import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  //what is props.onClick()??
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }


  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
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
          squares: Array(9).fill(null)
        }
      ],
      xIsNext: true,
      stepNumber: 0
    };
  }

  handleClick(i) {
    //slice() creates a copy
    const history = this.state.history;
    const current = history[history.length - 1]
    const squares = current.squares.slice();
    const previouslyClicked = squares[i];
    const someoneHasWon = calculateWinner(squares);
    if (!someoneHasWon && !previouslyClicked) {
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
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
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const isGameOver = (this.state.stepNumber === 9);

    const moves = history.map((step, move) => {
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
            squares={current.squares}
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
