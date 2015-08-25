'use strict';

angular.module('myApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'LocalStorageModule'
])
    .factory('Game', function ($window, $rootScope, localStorageService) {
      angular.element($window).on('storage', function(event) {
        $rootScope.$broadcast('changeLocalstorage');
        $rootScope.$apply();
      });

      var gameBoard = localStorageService.get('board');
      var gamePlayer = getPlayer();
      var spacesLeft = getSpacesLeft();
      var gameStatus = "It's Player " + (gamePlayer + 1) + "'s Turn!";
      var isGameEnded = 0;

      function refreshBoard(){
        gameBoard = localStorageService.get('board');
        gamePlayer = getPlayer();
        spacesLeft = getSpacesLeft();
        gameStatus = "It's Player " + (gamePlayer + 1) + "'s Turn!";
      };

      function createBoard(r, c){
        setSpacesLeft(r * c);
        setPlayer(0);
        localStorageService.add('isGameEnded', 0);

        var rows = r
        var columns = c
        var board = [];

        for(var i = 0; i < columns; i++){
          var inside = [];
          for(var j = 0; j < rows; j++){
            inside.push('');
          }
          board.push(inside);
        }
        gameStatus = "Hello!!! It's Player " + (gamePlayer + 1) + "'s Turn!";
        setBoard(board);
        gameBoard = board;


        return board;
      };

      function getBoard(){
        return localStorageService.get('board');
      };

      function getPlayer(){
        return localStorageService.get('player');
      }

      function setPlayer(p){
        localStorageService.add('player', p);
        gamePlayer = p;
      }

      function getStatus(){
        return gameStatus;
      }

      function setBoard(b){
        localStorageService.add('board', b);
      }

      function dropDisc(column){
        var rows = gameBoard[column];
        for(var i = 0; i < rows.length; i++){
          if(rows[i] == ""){
            gameBoard[column][i] = gamePlayer ? 'X' : 'O';
            setBoard(gameBoard);
            checkForConclusion([column,i]);
            break;
          }
        }
      }

      function checkForConclusion(move){
        decrementSpacesLeft();
        if(isWin(move)){
          gameStatus = "Player " + (gamePlayer + 1) + " wins!";
          localStorageService.add('isGameEnded', 1);
        }
        else if(spacesLeft == 0){
          gameStatus = "Draw!";
          localStorageService.add('isGameEnded', 1);
        } else {
          nextTurn();
        }
      }

      function nextTurn(){
        gamePlayer = gamePlayer ? 0 : 1;
        setPlayer(gamePlayer);
        gameStatus = "It's Player " + (gamePlayer + 1) + "'s Turn!";
      }

      function getSpacesLeft(){
        localStorageService.get('spacesLeft');
      }

      function decrementSpacesLeft(){
        spacesLeft = spacesLeft - 1;
        localStorageService.add('spacesLeft', spacesLeft);
      }

      function setSpacesLeft(s){
        spacesLeft = s;
        localStorageService.add('spacesLeft', s);
      }

      function isWin(move){
        var x = move[0];
        var y = move[1];
        var currentCell = gameBoard[x][y];

        if(checkVerticalWin(x, y, currentCell) || checkOtherWin(x, y, currentCell)){
          return true;
        } else {
          return false;
        }
      }

      function checkVerticalWin(x, y, currentCell){
        for(var i = 1; i < 4; i++){
          var row = y - i;
          if(row < 0 || gameBoard[x][row] != currentCell){
            return false;
          }
        }
        return true;
      }

      function checkOtherWin(x, y, currentCell){
        var slopes = [-1, 1, 0];
        var isWin = false;

        // check each of the directions

        for(var k = 0; k < 3; k++){
          var slope = slopes[k];
          var count = 1;

          // check Left Side
          for(var i = 1; i < 4; i++){
            var column = x - i;
            var row = y - (slope * i);
            var outOfBounds = column < 0 || row < 0 || column >= gameBoard.length || row >= gameBoard[0].length;

            // Check to see if it hits the edge

            if( outOfBounds || (gameBoard[column][row] != currentCell)){
              break;
            } else {
              count++;
            }
          }

          if(count < 4){
            // check right Side
            for(var i = 1; i < 4; i++){
              var column = x + i;
              var row = y + (slope * i);

              var outOfBounds = column < 0 || row < 0 || column >= gameBoard.length || row >= gameBoard[0].length;

              // Check to see if it hits the edge

              if(outOfBounds || (gameBoard[column][row] != currentCell)){
                break;
              } else {
                count++;
                if(count == 4){
                  isWin = true;
                  break;
                }
              }
            }
          } else {
            isWin = true;
            break;
          }
        };
        return isWin;
      };

      return {
        'createBoard': function (r, c){
          return createBoard(r,c);
        },
        'getBoard': function () {
          return getBoard();
        },
        'setBoard': function (b) {
          return setBoard(b);
        },
        'getPlayer': function () {
          return getPlayer();
        },
        'setPlayer': function (p) {
          return setPlayer(p);
        },
        'dropDisc': function (column) {
          return dropDisc(column);
        },
        'getStatus': function () {
          return getStatus();
        },
        'refreshBoard': function () {
          return refreshBoard();
        },
        'isGameEnded': function () {
          return localStorageService.get('isGameEnded');
        }
      };
    })
    .filter('reverse', function(){
      return function(items){
        return items.slice().reverse();
      };
    })
  .config(['localStorageServiceProvider', '$routeProvider', function(localStorageServiceProvider, $routeProvider){
    localStorageServiceProvider.setPrefix('ls');
    $routeProvider
      .when('/games/:id', {
        templateUrl: 'views/main.html',
        controller: 'MaintCtrl'
      })
      .otherwise({
        redirectTo: '/games/1'
      });
  }]);
