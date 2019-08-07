const express = require('express');
const socket = require('socket.io');
const utils = require('./utils');

var app = express();
var gameMapping = {};
var server = app.listen(4000, function () {
    console.warn("app is listeneing to requests on port 4000");
})


var io = socket(server);

io.on('connection', function (socket) {
    console.log("made a socket connection");

    socket.on('join', function (address) {
        console.warn(address, "joined");
        if (!Object.keys(gameMapping).length) {
            generateNewGame(address, socket);
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

})

function generateNewGame(address, socket) {
    var gameId = generateRandomId();
    gameMapping[gameId] = new GameObject(gameId, address, socket);
    return gameMapping[gameId];
}

function getPendingGame() {
    for (var key in gameMapping) {
        if (gameMapping[key].isWaiting) return gameMapping[key];
    }
    return false;
}


function generateRandomId() {
    return Math.floor(Math.random() * 1000000000000000);
}

function GameObject(id, address, socket) {
    console.warn("New Game Object defined");
    this.id = id;
    this.players = 0;
    this.isWaiting = true;
    this.playerAddress = [];
    this.connections = [];

    this.addPlayer = function (address, socket) {
        if (this.players < 2) {
            this.players++;
            this.playerAddress.push(address);
            this.connections.push(socket);
            if (this.players == 2) {
                this.start();
            }
        }
    }
    this.start = function () {
        console.warn('staring new game', this.id);
        var firstChance = Math.round(Math.random());
        this.connections[firstChance].emit("start", true, this.id);
        this.connections[1 - firstChance].emit("start", false, this.id);
        this.isWaiting = false;
    }

    this.sendDataToClient = function (fromAddress, data) {
        var index = this.playerAddress.indexOf(fromAddress);
        if (index != -1) {
            this.connections[1 - index].emit("play", data);
        }else{
            console.warn("NOT FOUND")
        }
    }
    this.addPlayer(address, socket);
}