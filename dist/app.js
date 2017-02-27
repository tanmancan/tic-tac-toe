'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* jshint esversion: 6 */
var TicTacToe = function () {
  function TicTacToe() {
    _classCallCheck(this, TicTacToe);

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
    for (var i = 0; i < 9; i++) {
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
    var nextPlayer = this.currentPlayer !== 0 ? 0 : 1;

    // Disable selection for next player
    this.playerList[nextPlayer].classList.add('disabled');
    this.playerList[nextPlayer].draggable = false;

    // Setup scoreboard
    this.score = [0, 0];
    this.scoreX = document.getElementById('score-x');
    this.scoreO = document.getElementById('score-o');
  }

  // Switch players every turn


  _createClass(TicTacToe, [{
    key: 'switchPlayer',
    value: function switchPlayer() {
      // Get next player
      var nextPlayer = this.currentPlayer !== 0 ? 0 : 1;

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

  }, {
    key: 'calculateGrid',
    value: function calculateGrid() {
      var grid = document.querySelectorAll('#tic-tac-grid > div'),
          playerOneSum = '',
          playerTwoSum = '',
          playerSum = {},
          totalSum = '';

      // Create an index of grid items that have been marked by players
      Object.keys(grid).forEach(function (key) {
        var playerSelection = grid[key].getAttribute('data-player');

        if (playerSelection === '0') {
          playerOneSum += key;
        }
        if (playerSelection === '1') {
          playerTwoSum += key;
        }
      });

      // To check for ties
      totalSum = playerOneSum + playerTwoSum;

      playerSum = {
        0: playerOneSum,
        1: playerTwoSum
      };

      this.checkTicTacToe(playerSum, totalSum);
    }

    // Check to see if player has tic tac toe

  }, {
    key: 'checkTicTacToe',
    value: function checkTicTacToe(playerSum, totalSum) {
      var players = [{ checkWinner: -1 }, { checkWinner: -1 }];

      // Possible winning combinations
      Object.keys(playerSum).forEach(function (key) {
        players[key].checkWinner = [playerSum[key].indexOf('012') > -1, playerSum[key].indexOf('345') > -1, playerSum[key].indexOf('678') > -1, playerSum[key].indexOf(0) > -1 && playerSum[key].indexOf(3) > -1 && playerSum[key].indexOf(6) > -1, playerSum[key].indexOf(1) > -1 && playerSum[key].indexOf(4) > -1 && playerSum[key].indexOf(7) > -1, playerSum[key].indexOf(2) > -1 && playerSum[key].indexOf(5) > -1 && playerSum[key].indexOf(8) > -1, playerSum[key].indexOf(0) > -1 && playerSum[key].indexOf(4) > -1 && playerSum[key].indexOf(8) > -1, playerSum[key].indexOf(2) > -1 && playerSum[key].indexOf(4) > -1 && playerSum[key].indexOf(6) > -1];
      });

      // Test each player selection for tic tac toe
      var checkPlayerWinner = players.map(function (player) {
        return player.checkWinner.indexOf(true) > -1;
      });

      // See if a player one
      if (checkPlayerWinner.indexOf(true) > -1) {
        var playerName = ['X', 'O'],
            playerIdx = checkPlayerWinner.indexOf(true),
            winner = players[playerIdx];

        this.titTacGrid.classList.add('winner-' + winner.checkWinner.indexOf(true));
        this.score[playerIdx] += 1;

        // Notify who won
        this.message.innerHTML = 'Player ' + playerName[playerIdx] + ' has won!';

        this.endRound();
      }

      // Check for tie
      if (totalSum.length === 9 && checkPlayerWinner.indexOf(true) < 0) {
        this.message.innerHTML = 'Tie!';

        this.endRound();
      }

      this.updateScoreBoard();
    }

    // Update score board

  }, {
    key: 'updateScoreBoard',
    value: function updateScoreBoard() {
      var _score = _slicedToArray(this.score, 2);

      this.scoreX.innerHTML = _score[0];
      this.scoreO.innerHTML = _score[1];
    }

    // End the current round

  }, {
    key: 'endRound',
    value: function endRound() {
      var _this = this;

      // Disable selection
      this.playerList.forEach(function (val, idx) {
        _this.playerList[idx].classList.add('disabled');
        _this.playerList[idx].draggable = false;
      });
    }

    // Start a new round

  }, {
    key: 'newRound',
    value: function newRound() {
      // Set random player for next round
      this.currentPlayer = Math.floor(Math.random() * 2);

      var nextPlayer = this.currentPlayer !== 0 ? 0 : 1;

      // Re-enabled player selection
      this.playerList[this.currentPlayer].classList.remove('disabled');
      this.playerList[this.currentPlayer].draggable = true;

      // Disable selection for next player
      this.playerList[nextPlayer].classList.add('disabled');
      this.playerList[nextPlayer].draggable = false;

      // Reset board
      this.titTacGrid.className = '';
      var grid = document.querySelectorAll('#tic-tac-grid > div');

      Object.keys(grid).forEach(function (key) {
        var gridItem = grid[key];

        gridItem.setAttribute('data-player', '');
        gridItem.innerHTML = '';
        gridItem.classList.remove('selected');
      });

      this.message.innerHTML = '';
    }

    // Event handlers

  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
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
  }, {
    key: 'onClick',
    value: function onClick(e) {
      if (e.target === this.newRoundButton) {
        this.newRound();
      }
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(e) {
      var edt = e.dataTransfer,
          data = {
        text: e.target.innerHTML,
        player: this.currentPlayer
      };
      edt.setData('application/javascript', JSON.stringify(data));
      e.dataTransfer.effectAllowed = 'move';
    }
  }, {
    key: 'onDrop',
    value: function onDrop(e) {
      // Mark tic tac grid with selection
      if (!e.target.classList.contains('selected')) {
        if (!e.dataTransfer.getData('application/javascript')) {
          e.target.classList.remove('active');
          return;
        }

        var data = JSON.parse(e.dataTransfer.getData('application/javascript'));

        e.target.innerHTML = data.text;
        e.target.classList.remove('active');
        e.target.classList.add('selected');
        e.target.setAttribute('data-player', data.player);

        e.preventDefault();

        this.switchPlayer();
      }
    }
  }, {
    key: 'onDragOver',
    value: function onDragOver(e) {
      if (!e.target.classList.contains('selected')) {
        e.target.classList.add('active');
        e.preventDefault();
      }
    }
  }, {
    key: 'onDragLeave',
    value: function onDragLeave(e) {
      e.target.classList.remove('active');
    }
  }]);

  return TicTacToe;
}();

var tictac = new TicTacToe();