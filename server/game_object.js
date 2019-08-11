const utils = require('./utils');
/*
    Constructor function to create an Object of game
    :Param id: random id of the game
    :Param address: address of the first player to request a new game
    :Param socket: web socket object of a player
*/
function GameObject(id, address, socket, rounds, bet) {
    this.id = id;               // Random ID of the game
    this.players = 0;           // Number of players
    this.isWaiting = true;      // is Game in waiting state
    this.playerAddress = [];    // Address of both players
    this.connections = [];      // Socket of both players
    this.previousBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // Previous Board to check from
    this.rounds = rounds;       // total number of rounds
    this.bet = bet;             // Bet for current round
    this.currentRound = 0;      // Current round number
    this.winnerMapping = {};    // Winners
    this.waitingNumber = 0;     // Number of player who are waiting
    this.finalWinner = null;    // Final winner


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
                this.sendEventToBothPlayers("continue");
            }
        }
    }

    /*
        Function to send the event to both players
        :Param event: type of event
        :Param data: data to be sent as payload
    */

    this.sendEventToBothPlayers = function (event,data) {
        if(!data){
            data = this.getEncryptedPayLoad()
        }
        this.connections[0].emit(event,data);
        this.connections[1].emit(event,data);
    }


    /*
        Function to increment waiting number and reset board
    */

    this.continueToGame = function (address) {
        console.warn("continue called",this.waitingNumber);
        this.waitingNumber++;
        if (this.waitingNumber == 2) {
            this.previousBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.start();
        }
    }


    /*
        Function to start the game
    */
    this.start = function () {
        if (!Object.keys(this.winnerMapping).length) {
            this.winnerMapping[this.playerAddress[0]] = 0;
            this.winnerMapping[this.playerAddress[1]] = 0;
        }
        
        this.currentRound++;
        var encryptedData = this.getEncryptedPayLoad();
        console.warn('staring new game', this.id);
        var firstChance = Math.round(Math.random());
        this.connections[firstChance].emit("start", true, encryptedData);
        this.connections[1 - firstChance].emit("start", false, encryptedData);
        this.isWaiting = false;
        this.waitingNumber = 0;
    }

    /*
        Function to send data to client
        :Param fromAddress: address of the player who sent the board to server
        :Param data: data to send to other player
    */
    this.sendDataToClient = function (fromAddress, data) {
        var verified = this.verifyWithPerviousBoard(data.board);
        var encryptedData = utils.encryptMessage(data);

        var index = this.playerAddress.indexOf(fromAddress);
        if (index != -1) {
            if (verified) {
                this.connections[1 - index].emit("play", encryptedData);
                var winner = utils.checkWinner(data.board);
                //console.warn(winner,data.board);
                if (winner) {
                    this.winnerMapping[fromAddress] += 1
                    if(this.currentRound == this.rounds){
                        this.finalWinner = this.settleScore();
                        this.sendEventToBothPlayers("endGame",this.getEncryptedPayLoad());
                    }else{
                        this.sendEventToBothPlayers("continue");
                    }
                    
                }
            } else {
                // TODO fromAddress Cheated do handling
            }

        } else {
            console.warn("NOT FOUND")
        }
    }

    /*
        Function to get encrupted payload
        :Returns: encrypted data string
    */
    this.getEncryptedPayLoad = function () {
        var data = this.getPayLoad();
        return utils.encryptMessage(data);
    }


    /*
        Function to get the state object of the game
        :Returns: current game object
    */
    this.getPayLoad = function () {
        return {
            id: this.id,
            bet: this.bet,
            rounds: this.rounds,
            currentRound: this.currentRound,
            winners: this.winnerMapping,
            finalWinner: this.finalWinner
        }
    }

    /*
        Function to veriify that new board is not malicious
        :Param newBoard: next state board of the game
        :Returns bool: True if board is not malicious false otherwise
    */
    this.verifyWithPerviousBoard = function (newBoard) {
        var differences = 0;

        if (newBoard && newBoard.length == 9) {
            for (var index in this.previousBoard) {
                if (this.previousBoard[index] != newBoard[index]) {
                    differences += 1
                }
            }
        }

        if (differences == 1) {
            //console.warn("Verified");
            this.previousBoard = newBoard;
            return true;
        }
        return false;
    }

    /*
        Function to settle score check if game mapping who is the last winner
        :Retruns: address of final winner
    */

    this.settleScore = function(){
        var winnerAddress = null;
        if(this.winnerMapping[this.playerAddress[0]] > this.winnerMapping[this.playerAddress[1]]){
            winnerAddress = this.playerAddress[0]
        }else if(this.winnerMapping[this.playerAddress[0]] == this.winnerMapping[this.playerAddress[1]]){
            winnerAddress = "Tied";
        }else{
            winnerAddress = this.playerAddress[1];
        }
        return winnerAddress;
    }


    this.addPlayer(address, socket);
    socket.emit("shareId", this.id);
}

module.exports = GameObject;