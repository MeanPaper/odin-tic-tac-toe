// tic tac toe 
const Player = (playerName, playerSymbol, playerColor) => {
  const symbol = playerSymbol;
  const nickname = playerName;
  const color = playerColor;
  
  function getSymbol(){
    return symbol;
  }
  function getName(){
    return nickname;
  }
  function getColor(){
    return `var(${color})`;
  }
  
  return { getSymbol, getName, getColor };
}

// game board factory function
const GameBoard = (function(){
  let board = ['', '', '', '', '', '', '', '', ''];
  const len = 9;

  // return game board
  function getBoard(){ 
    return board;
  }

  function getBoardItem(idx){
    return board[idx];
  }

  // set item on the game board
  function setBoardItem(idx, symbol){ 
    if(idx < 0 || idx >= len){
      throw Error('Invalid index');
    }
    else if(board[idx] === ""){
      board[idx] = symbol;
    }
  }

  // clean up the game
  function clearBoard(){
    board = board.map(item => '');
  }

  return { getBoard, getBoardItem, setBoardItem, clearBoard };
})();

const DisplayController = (function(){
  const boardItems = document.getElementsByClassName('board-item');  
  const messageBoard = document.querySelector('.message-panel');
  const restartButton = document.querySelector('.restart-button');

  // event listener
  for(let i = 0; i < 9; ++i){
    boardItems[i].addEventListener('click', (e) => {
      if(GameController.getIsOver()) return;
      if(GameBoard.getBoardItem(i) !== '') return;
      let player = GameController.getCurrentPlayer();
      e.target.style.color = player.getColor();
      GameBoard.setBoardItem(i, player.getSymbol());
      GameController.updateGameState(i);
      updateBoardDisplay();
    });
  }

  restartButton.addEventListener('click', () => {
    GameController.restartGame();
    GameBoard.clearBoard();
    updateBoardDisplay();
    DisplayController.restartMessage();
  });;
  
  // next board
  function updateBoardDisplay(){ 
    const next_board = GameBoard.getBoard();
    next_board.forEach((item, idx) => {
      boardItems[idx].innerHTML = item;
    })
  }

  function showMessage(msg){
    const player = GameController.getCurrentPlayer();
    const round = GameController.getRound();
    if(!GameController.getIsOver()){
      messageBoard.innerHTML = `Round ${round}, ${player.getName()}'s Turn`;
      return;
    }

    if(msg === 'Draw'){
      messageBoard.innerHTML = `Game over, A ${msg}!`;
    }
    else{
      messageBoard.innerHTML = `Game over, ${player.getName()} ${msg}!`;
    }
    
  }

  function restartMessage(){
    messageBoard.innerHTML = `Round 1, Player X's Turn`;
  }
  return { showMessage, restartMessage }
})();


const GameController = (function(){
  let round = 1;
  isOver = false;

  const player1 = Player('Player X', 'X', "--yellow-300");
  const player2 = Player('Player O', 'O', "--slate-100");
  
  function checkWin(playIndex){
    const winMap = [ [0,1,2], [3,4,5],
                     [6,7,8], [0,3,6],
                     [1,4,7], [2,5,8],
                     [2,4,6], [0,4,8] ];
    return winMap.filter(item => item.includes(playIndex)).some(comb => 
      comb.every(idx => {
        return GameBoard.getBoardItem(idx) === getCurrentPlayer().getSymbol();
      })
    );
  }
  
  function updateGameState(playIndex){

    const isWin = checkWin(playIndex);
    if(isWin || round == 9){
      isOver = true;
      if(isWin) DisplayController.showMessage('Wins');
      else DisplayController.showMessage('Draw');
      return;
    }
    round++;
    DisplayController.showMessage('');
  }
  
  function getCurrentPlayer(){
    return round % 2 === 0 ? player2 : player1;
  }

  function getIsOver(){
    return isOver;
  }
  
  function getRound(){
    return round;
  }

  function restartGame(){
    round = 1;
    isOver = false;
  }
  return { getCurrentPlayer, updateGameState, getIsOver, getRound, restartGame};
})();