const express = require('express');
const socket = require('socket.io');


var app = express();
var gameMapping = {};
var server = app.listen(4000, function () {
    console.warn("app is listeneing to requests on port 4000");
})


var io = socket(server);

io.on('connection', function (socket) {
    console.log("made a socket connection");



    socket.on('join', function (address) {
        console.warn(address,"joined");
        if (!Object.keys(gameMapping).length) {
            console.warn("Creating new game");
            generateNewGame(address,socket);
        }else{
            var currentGame = getPendingGame();
            if(!currentGame){
                currentGame = generateNewGame(address,socket);
            }else{
                console.warn("found already pending game",currentGame.id);
            }
            currentGame.addPlayer(address,socket);
        }
    })

    socket.on('play', function (data) {
        console.warn(data);
        socket.broadcast.emit("play", data);
    })

})

function generateNewGame(address,socket){
    var gameId = generateRandomId();
    gameMapping[gameId] = new GameObject(gameId, address, socket);
    return gameMapping[gameId];
}

function getPendingGame(){
    for(var key in gameMapping){
        if(gameMapping[key].isWaiting) return gameMapping[key];
    }
    return false;
}


function generateRandomId() {
    return Math.floor(Math.random() * 1000000000000000);
}

function GameObject(id, address, socket) {
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
        console.warn('staring new game');
        var firstChance = Math.round(Math.random());
        console.warn(firstChance);
        this.connections[firstChance].emit("start", true, this.id);
        this.connections[1 - firstChance].emit("start", false, this.id);
        this.isWaiting = false;
    }

    this.sendDataToClient = function (data) {

    }
    this.addPlayer(address,socket);
}