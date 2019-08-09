
/*
    Constructor function to create an Object of game
    :Param id: random id of the game
    :Param address: address of the first player to request a new game
    :Param socket: web socket object of a player
*/
function GameObject(id, address, socket,rounds) {
    console.warn("New Game Object defined");
    this.id = id;               // Random ID of the game
    this.players = 0;           // Number of players
    this.isWaiting = true;      // is Game in waiting state
    this.playerAddress = [];    // Address of both players
    this.connections = [];      // Socket of both players
    this.rounds = rounds;


    /*
        Function to add a player to the game
        :Param address: address of the player
        :Param socket: websocket of the player
    */
    this.addPlayer = function (address, socket) {
        if (this.players < 2) {
            this.players++;
            this.playerAddress.push(address);
            this.connections.push(socket);

            if (this.players == 2) { // If both players have joined the game then start
                this.start();
            }
        }
    }

    /*
        Function to start the game
    */
    this.start = function () {
        console.warn('staring new game', this.id);
        var firstChance = Math.round(Math.random());
        this.connections[firstChance].emit("start", true, this.id);
        this.connections[1 - firstChance].emit("start", false, this.id);
        this.isWaiting = false;
    }

    /*
        Function to send data to client
        :Param fromAddress: address of the player who sent the board to server
        :Param data: data to send to other player
    */
    this.sendDataToClient = function (fromAddress, data) {
        var index = this.playerAddress.indexOf(fromAddress);
        if (index != -1) {
            this.connections[1 - index].emit("play", data);
        } else {
            console.warn("NOT FOUND")
        }
    }
    this.addPlayer(address, socket);
}

module.exports = GameObject;