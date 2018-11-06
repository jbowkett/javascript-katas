import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


//why is this a function and not a class, again?...I think because it
// doesn't need a separate render method
function Square(props) {
  //what is props.onClick()?? - function passed in properties when the class
  // is constructed in the <Square/> tag
  return (
    <button className={props.classNames} onClick={props.onClick}>
      {props.value}
    </button>
  );
}


function Status(props){
  const isGameOver = (props.selectedMoveNumber === 9);
  let status;
  if (props.winner) {
    status = 'Congrats, the winner is:' + props.winner.winnerName;
  }
  else if (isGameOver) {
    status = 'Game over - stalemate!'
  }
  else {
    status = 'Next Player is: ' + (props.gameState.xIsNext ? 'X' : 'O');
  }
  return <div>{status}</div>;
}


class History extends React.Component {


  descending = {label : '\\/ Sort Descending \\/', isDescending : true};
  ascending = {label : '/\\ Sort Ascending /\\', isDescending : false};

  constructor(props) {
    super(props);
    this.state = this.descending;
  }

  toggleSortOrder() {
    if(this.state.isDescending){
      this.setState(this.ascending);
    }
    else{
      this.setState(this.descending);
    }
  }


  render() {
    const orderedHistory = this.getHistoryInOrder();
    return (
      <div>
       <button onClick={()=>this.toggleSortOrder()}>
         {this.state.label}</button>
       <ol>{orderedHistory}</ol>
      </div>
    );
  }

  getHistoryInOrder() {
    function doMapping(moveNumber, props, moveDesc) {
      const style = moveNumber === props.selectedMoveNumber ? ' selected-history' : '';

      const desc = moveNumber ?
        'Go to move #' + (moveNumber + ' ' + moveDesc) :
        'Go to game start';
      return (
        <li key={moveNumber}>
          <button className={style}
                  onClick={() => props.onClick(moveNumber)}>
            {desc}</button>
        </li>
      );
    }

    var allHistory = this.props.allHistory.slice();
    var mapped = new Array(allHistory.length);

    if(this.state.isDescending) {
      allHistory = allHistory.reverse();
    }
    for (let i = 0; i < allHistory.length; i++) {
      const moveNumber = this.state.isDescending ? allHistory.length - i - 1: i;
      mapped[i] = doMapping(moveNumber, this.props, allHistory[i].moveDescription);
    }
    return mapped;
  }
}


class Board extends React.Component {

  render() {
    function renderBoardRow(props, range) {
      function renderRow() {
        function renderSquare(i) {
          const style = props.winningSquares && props.winningSquares.includes(i) ?
          'square highlighted': 'square';
          return <Square
            key={i}
            value={props.squaresState[i].squareOwner}
            classNames={style}
            onClick={() => props.onClick(i)}
          />;
        }
        return range.map(
          function (index) {
            return renderSquare(index);
          }
        );
      }
      return <div className="board-row">
              {renderRow()}
             </div>;
    }

    return (
      <div>
        { renderBoardRow(this.props, [0, 1, 2]) }
        { renderBoardRow(this.props, [3, 4, 5]) }
        { renderBoardRow(this.props, [6, 7, 8]) }
      </div>
    );
  }
}

class Game extends React.Component {
  moveDescriptions = ['(1,1)', '(1,2)', '(1,3)',
                      '(2,1)', '(2,2)', '(2,3)',
                      '(3,1)', '(3,2)', '(3,3)'];

  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squaresStateArray: Array(9).fill({squareOwner:null})
        }
      ],
      xIsNext: true,
      stepNumber: 0
    };
  }

  handleClick(i) {
    //slice() creates a copy
    const history = this.state.history;
    const currentMove = history[history.length - 1];
    const currentMoveSquares = currentMove.squaresStateArray.slice();
    const squareAlreadyOwned = currentMoveSquares[i].squareOwner;

    const someoneHasWon = calculateWinner(currentMoveSquares);

    if (!someoneHasWon && !squareAlreadyOwned) {
      currentMoveSquares[i] = {
        squareOwner: this.state.xIsNext ? 'X' : 'O',
      };

      this.setState({
        history: history.concat([{
          squaresStateArray: currentMoveSquares,
          moveDescription: this.moveDescriptions[i]
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
    const selectedMoveNumber = this.state.stepNumber;

    const selectedMove = allHistory[selectedMoveNumber];

    const winner = calculateWinner(selectedMove.squaresStateArray);
    const winningSquares =  winner ? winner.winningSquares : null;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squaresState={selectedMove.squaresStateArray}
            winningSquares={winningSquares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <Status selectedMoveNumber = {selectedMoveNumber}
                  winner = {winner}
                  gameState = {this.state}/>
          <History onClick = {(i) => this.jumpTo(i)}
                   allHistory = {allHistory}
                   selectedMove = {selectedMoveNumber}/>
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
    const boardSquaresAOwner = boardSquares[a].squareOwner;
    const boardSquaresBOwner = boardSquares[b].squareOwner;
    const boardSquaresCOwner = boardSquares[c].squareOwner;
    if (boardSquaresAOwner &&
        boardSquaresAOwner === boardSquaresBOwner &&
        boardSquaresAOwner === boardSquaresCOwner) {
      return {
        winnerName: boardSquares[a].squareOwner,
        winningSquares:[a, b, c]
      };
    }
  }
  return null;
}
