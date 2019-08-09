const express = require('express');
const socket = require('socket.io');
const utils = require('./utils');
const GameObject = require("./game_object")
var app = express();
//Data structure to save game mapping of games
var gameMapping = {};



var server = app.listen(4000, function () {
    console.warn("app is listeneing to requests on port 4000");
})


var io = socket(server);

io.on('connection', function (socket) {
    console.log("made a socket connection");
    addListeners(socket);
})

/*
    Function to add Listenres
    :Param socket: web socket object
    :Event join: is called when user requets to join a game
    :Event play: is called when user takes his turn and send data to server
*/
function addListeners(socket) {
    socket.on('join', function (address,rounds) {
        console.warn(address, "joined");
        if (!Object.keys(gameMapping).length) {
            generateNewGame(address, socket,rounds);
        } else {
            var currentGame = getPendingGame();
            if (!currentGame) {
                currentGame = generateNewGame(address, socket);
            } else {
                console.warn("found already pending game", currentGame.id);
                currentGame.addPlayer(address, socket);
            }

        }
    })

    socket.on('play', function (data) {
        var decryptedData = utils.decryptMessage(data);
        var id = decryptedData.gameId;
        var address = decryptedData.address;
        if (id in gameMapping) {
            gameMapping[id].sendDataToClient(address, data);
        }
        //socket.broadcast.emit("play", data);
    })
}

/*
    Function to create an new game
    :Param address: address of the player
    :Param socket: socket object
*/
function generateNewGame(address, socket) {
    var gameId = utils.generateRandomId();
    gameMapping[gameId] = new GameObject(gameId, address, socket);
    return gameMapping[gameId];
}


/*
    Function to check is any player is waiting for another player to join
*/
function getPendingGame() {
    for (var key in gameMapping) {
        if (gameMapping[key].isWaiting) return gameMapping[key];
    }
    return false;
}