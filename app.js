/* jshint esversion: 6 */
class TicTacToe {
  constructor() {
    // Initial settings
    this.dev = true;

    // Get selection and playing board
    this.selectionX = document.getElementById('selection-x');
    this.selectionO = document.getElementById('selection-o');
    this.titTacGrid = document.getElementById('tic-tac-grid');
    this.newRoundButton = document.getElementById('new-round');
    this.message = document.getElementById('message');

    // Reset board button
    this.newRoundButton.addEventListener('click', this, false);

    // Enable draggable
    this.selectionX.draggable = true;
    this.selectionO.draggable = true;

    // Set drag events
    this.selectionX.addEventListener('drag', this, false);
    this.selectionX.addEventListener('dragstart', this, false);
    this.selectionO.addEventListener('drag', this, false);
    this.selectionO.addEventListener('dragstart', this, false);

    // Create tic tac grid
    for (let i = 0; i < 9; i++) {
      // Grid item
      this['grid-' + i] = document.createElement('div');

      // Set drop and dropover event
      this['grid-' + i].addEventListener('drop', this, false);
      this['grid-' + i].addEventListener('dragover', this, false);
      this['grid-' + i].addEventListener('dragleave', this, false);

      // Add item to board
      this.titTacGrid.appendChild(this['grid-' + i]);
    }

    // Setup players - randomize who goes first
    this.playerList = [this.selectionX, this.selectionO];
    this.currentPlayer = Math.floor(Math.random() * 2);

    // Get next player
    let nextPlayer = (this.currentPlayer !== 0) ? 0 : 1;

    // Disable selection for next player
    this.playerList[nextPlayer].classList.add('disabled');
    this.playerList[nextPlayer].draggable = false;

    // Setup scoreboard
    this.score = [0, 0];
    this.scoreX = document.getElementById('score-x');
    this.scoreO = document.getElementById('score-o');
  }

  // Switch players every turn
  switchPlayer() {
    // Get next player
    let nextPlayer = (this.currentPlayer !== 0) ? 0 : 1;

    // Disable current player
    this.playerList[this.currentPlayer].classList.add('disabled');
    this.playerList[this.currentPlayer].draggable = false;

    // Switch player
    this.playerList[nextPlayer].classList.remove('disabled');
    this.playerList[nextPlayer].draggable = true;

    this.currentPlayer = nextPlayer;

    this.calculateGrid();
  }

  // Check the grid for player selection
  calculateGrid() {
    let grid = document.querySelectorAll('#tic-tac-grid > div'),
      playerOneSum = '',
      playerTwoSum = '',
      totalSum = '';

    // Create an index of grid items that have been marked by players
    Object.keys(grid).forEach(function(key) {
      let playerSelection = grid[key].getAttribute('data-player');

      if (playerSelection === '0') {
        playerOneSum += key;
      }
      if (playerSelection === '1') {
        playerTwoSum += key;
      }
    });

    // To check for ties
    totalSum = playerOneSum + playerTwoSum;

    // Check to see if each player have gotten tic tac toe
    this.checkTicTacToe(playerOneSum, 0, totalSum);
    this.checkTicTacToe(playerTwoSum, 1, totalSum);
  }

  // Check to see if player has tic tac toe
  checkTicTacToe(playerSum, player, totalSum) {
    // Possible winning combinations
    let checkWinner = [
      (playerSum.indexOf('012') > -1),
      (playerSum.indexOf('345') > -1),
      (playerSum.indexOf('678') > -1),
      (playerSum.indexOf(0) > -1 && playerSum.indexOf(3) > -1 && playerSum.indexOf(6) > -1),
      (playerSum.indexOf(1) > -1 && playerSum.indexOf(4) > -1 && playerSum.indexOf(7) > -1),
      (playerSum.indexOf(2) > -1 && playerSum.indexOf(5) > -1 && playerSum.indexOf(8) > -1),
      (playerSum.indexOf(0) > -1 && playerSum.indexOf(4) > -1 && playerSum.indexOf(8) > -1),
      (playerSum.indexOf(2) > -1 && playerSum.indexOf(4) > -1 && playerSum.indexOf(6) > -1),
    ];

    // Check for tie
    if (totalSum.length === 9 && checkWinner.indexOf(true) < 0) {
      this.message.innerHTML = `Tie!`;
      this.endRound();
    }

    // Get the winner
    if (checkWinner.indexOf(true) > -1) {
      let playerName = ['X', 'O'];

      this.titTacGrid.classList.add('winner-' + checkWinner.indexOf(true));
      this.score[player] += 1;

      // Notify who won
      this.message.innerHTML = `Player ${playerName[player]} has won!`;

      this.endRound();
    }

    this.updateScoreBoard();
  }

  // Update score board
  updateScoreBoard() {
    this.scoreX.innerHTML = this.score[0];
    this.scoreO.innerHTML = this.score[1];
  }

  // End the current round
  endRound() {
    // Disable selection
    this.playerList[0].classList.add('disabled');
    this.playerList[0].draggable = false;
    this.playerList[1].classList.add('disabled');
    this.playerList[1].draggable = false;
  }

  // Start a new round
  newRound() {
    // Set random player for next round
    this.currentPlayer = Math.floor(Math.random() * 2);

    let nextPlayer = (this.currentPlayer !== 0) ? 0 : 1;

    // Re-enabled player selection
    this.playerList[this.currentPlayer].classList.remove('disabled');
    this.playerList[this.currentPlayer].draggable = true;

    // Disable selection for next player
    this.playerList[nextPlayer].classList.add('disabled');
    this.playerList[nextPlayer].draggable = false;

    // Reset board
    this.titTacGrid.className = '';
    let grid = document.querySelectorAll('#tic-tac-grid > div');

    Object.keys(grid).forEach(function(key) {
      let gridItem = grid[key];

      gridItem.setAttribute('data-player', '');
      gridItem.innerHTML = '';
      gridItem.classList.remove('selected');
    });

    this.message.innerHTML = '';
  }

  // Event handlers
  handleEvent(e) {
    switch (e.type) {
      case 'click':
        this.onClick(e);
        break;
      case 'dragstart':
        this.onDragStart(e);
        break;
      case 'drop':
        this.onDrop(e);
        break;
      case 'dragover':
        this.onDragOver(e);
        break;
      case 'dragleave':
        this.onDragLeave(e);
        break;
    }
  }

  onClick(e) {
    if (e.target === this.newRoundButton) {
      this.newRound();
    }
  }

  onDragStart(e) {
    let edt = e.dataTransfer,
      data = {
        text: e.target.innerHTML,
        player: this.currentPlayer
      };
    edt.setData('application/javascript', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
  }

  onDrop(e) {
    // Mark tic tac grid with selection
    if (!e.target.classList.contains('selected')) {
      let data = JSON.parse(e.dataTransfer.getData('application/javascript'));

      e.target.innerHTML = data.text;
      e.target.classList.remove('active');
      e.target.classList.add('selected');
      e.target.setAttribute('data-player', data.player);

      e.preventDefault();

      this.switchPlayer();
    }
  }

  onDragOver(e) {
    if (!e.target.classList.contains('selected')) {
      e.target.classList.add('active');
      e.preventDefault();
    }
  }

  onDragLeave(e) {
    e.target.classList.remove('active');
  }
}

const tictac = new TicTacToe();
