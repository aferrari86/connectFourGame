'use strict';

angular.module('myApp')
    .controller("MaintCtrl", function($rootScope, $scope, $routeParams, Game) {
      var vm = this;

        var loggedUser = $routeParams.id;
        vm.canPlay = function(){
            return loggedUser == Game.getPlayer()+1 && !(vm.isGameEnded === 1);
        };
        vm.builtBoard = Game.getBoard();
        vm.player = Game.getPlayer() || 0;
        vm.move = move;
        vm.gameStatus = Game.getStatus();
        vm.isGameEnded = Game.isGameEnded();


        vm.createBoard = createBoard;


        // define functions here

        function createBoard(){
            vm.builtBoard = Game.createBoard(6, 7);
        }

        function move(column, columnLength){
            if(vm.canPlay() && vm.builtBoard[column][columnLength] === ""){
                Game.dropDisc(column);
                vm.player = Game.getPlayer();
                vm.builtBoard = Game.getBoard();
                vm.gameStatus = Game.getStatus();
            }

        }

        $rootScope.$on('changeLocalstorage',function(){
            Game.refreshBoard();
            vm.player = Game.getPlayer();
            vm.builtBoard = Game.getBoard();
            vm.gameStatus = Game.getStatus();
            vm.isGameEnded = Game.isGameEnded();
        });
});