const utils = require("./utils");
const io = require('socket.io-client');
const validators = require('./validators');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

class Game {
    constructor(address) {
        //this.players = players;
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.isYourTurn = false;
        this.address = address;
        this.winner = undefined;
        this.socket = io.connect("http://localhost:4000");
        this.gameId = null;
        this.rounds = 1;
        this.currentRound = 0;
        this.bet = 0;
        this.debug = true;
        this.scores = null;
        this.newGame = this.setupGameType();
        this.contractAddress = null;
        this.addListeners();
    }
    /*
        Function to setup game type ie new game of old game

    */
    setupGameType() {
        readline.question("Do you want to create new game? [y/n] ", (choice) => {
            if (validators.yesAndNoValidator(choice)) {
                if (this.debug) {
                    // Write Logic to create contract;
                    this.socket.emit("newGame", this.address, 3, 2);
                } else {
                    this.takeRoundsInput();
                }
            } else {
                readline.question("Enter Game Id: ", (gameNumber) => {
                    this.id = gameNumber;
                    this.socket.emit("join", this.address, gameNumber);
                })
            }
        })
    }

    /*
        Function to take number of rounds input
    */

    takeRoundsInput(callback) {
        readline.question("How many rounds?[Numeric Input] ", (rounds) => {
            if (validators.positiveNumberValidator(rounds)) {
                this.rounds = rounds;
                this.takeBetInput();
            } else {
                console.warn("Invalid input");
                this.takeRoundsInput(callback);
            }
        })

    }

    /*
        Function to take bet input
    */

    takeBetInput() {
        readline.question("How much do you want to bet? [In ETH]:  ", (bet) => {
            if (validators.positiveNumberValidator(bet)) {
                this.bet = bet;
                this.socket.emit("newGame", this.address, this.rounds, this.bet);
            } else {
                console.warn("Invalid input");
                this.takeBetInput();
            }
        })
    }

    /*

     Function to take user input only called when it is user's turn

    */
    takeUserInput() {
        readline.question(`Input Index: `, (index) => {
            if (validators.boardIndexValidator(index, this.board)) {
                this.updateBoard(index);
                // readline.close();
            } else {
                console.warn("Invalid Input!");
                this.takeUserInput();
            }
        })
    }


    /*
        Function to add listeners for websockets
        :Event start: is called when game is started
        :Event play: is event which is called when user takes his turn
        :Event join: is called when player wants to join
    */
    addListeners() {

        this.socket.on("start", (isYourTurn, gameId) => {
            this.start(isYourTurn, gameId)
        });
        this.socket.on("play", (param) => {
            this.recieveDataFromServer(param)
        });
        this.socket.on("continue", (data) => {
            this.continueToGame(data);
        })

        this.socket.on("shareId", (gameId) => {
            console.warn("Share your game id with opponent: ", gameId);
            this.id = gameId;
        })
        this.socket.on("endGame", (data) => {
            var decryptedData = utils.decryptMessage(data);
            this.endGame(decryptedData);
        })
    }

    /*
        Function to do initial setup
        setup your turn, gameId and your inital sign
    */
    start(isYourTurn, data) {
        var decryptedData = utils.decryptMessage(data);
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.isYourTurn = isYourTurn;
        this.gameId = decryptedData.id;
        this.bet = decryptedData.bet;
        this.rounds = decryptedData.rounds;
        this.scores = decryptedData.winners;
        this.currentRound = decryptedData.currentRound;
        this.sign = (this.isYourTurn) ? "X" : "O";
        this.winner = null;
        this.displayBoard();
    }

    /*
        Function to end game
    */
    endGame(data) {
        console.clear();
        displayGameInfo(data.finalWinner);
    }

    /*
        Function to display continue game
    */

    continueToGame(data) {
        var message = "Start game?[y/n] ";
        if (this.winner) {
            message = "Start next game?[y/n] "
        }
        readline.question(message, (choice) => {
            if (validators.yesAndNoValidator(choice)) {
                this.socket.emit("continue", this.address, this.id);
            } else {
                // TODO yes player forfiets the match
            }
        })
    }

    /*
        Function to display to board to console
    */
    displayBoard() {
        console.clear();
        displayGameInfo();
        console.warn();
        var stringToPrint = '\t\t';
        for (var i = 0; i < 9; i++) {
            if (this.board[i]) {    // Index has some value 
                stringToPrint += "\t" + this.board[i] + "\t";
            } else {                // Empty slot
                stringToPrint += "\t\t";
            }
            stringToPrint += "|"
            if ((i + 1) % 3 == 0) {
                stringToPrint += "\n\t\t";
            }

        }
        console.warn(stringToPrint);

        if (this.winner) {
            console.warn(`Winner is player: ${this.winner}`);
        }

        if (this.isYourTurn && !this.winner) {
            this.takeUserInput();
        }
    }

    /*
        Function to display ingame Info like totoal rounds, current rounds, total bet
        :Param finalWinner: address of the winner, if pass it is displayed
    */

    displayGameInfo(finalWinner) {
        console.warn("Total rounds: ", this.rounds);
        console.warn("Current round: ", this.currentRound);
        console.warn(`Total Bet: ${this.bet} ETH`);
        for (var key in this.scores) {
            console.warn(`Score of ${key}: ${this.scores[key]}`);
        }
        if (finalWinner) {
            if (finalWinner == "Tied") {
                console.warn("Match Tied");
            } else {
                console.warn(`Final Winner is ${finalWinner}`);
            }

        }
    }
    /*
        Function to display waiting message
    */
    displayWaiting() {
        console.log("Waiting for opponent....");
    }

    /*
        Function to check if the winner is decided
    */
    checkWinner() {
        var oWinner = "OOO",
            xWinner = "XXX";
        var posibleCombinations = [     // All posible winning combinations
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (var index in posibleCombinations) {
            var combination = posibleCombinations[index];
            var string = '';
            for (var innerIndex in combination) {
                string += this.board[combination[innerIndex]];
            }
            if (string === oWinner) {
                this.winner = oWinner;
            }
            if (string == xWinner) {
                this.winner = xWinner;
            }
        }
    }

    /*
        Function is called when data is recieved from the server
        :Param game: gameObject containing the new board position
    */
    updateState(game) {
        this.isYourTurn = true;
        this.board = game.board;

        this.checkWinner();
        this.displayBoard();
    }

    /*
        Function to update board position when user takes his turn
        Checked if winner is descided and sends data to server
        :Param index: index of board already validated
    */
    updateBoard(index) {
        console.warn("updated board called");
        this.board[index - 1] = this.sign;
        this.isYourTurn = false;
        this.checkWinner();
        this.displayBoard();
        if (!this.winner) {
            this.displayWaiting();
        }
        this.sendDataToServer("play");
    }





    /*
        Function to construct the gameObject to send to server
        Encrypts data and sends data to server
    */
    sendDataToServer(event) {
        var gameObject = {
            address: this.address,
            board: this.board,
            winner: this.winner,
            gameId: this.gameId
        }
        var encryptedData = utils.encryptMessage(gameObject);

        // Write logic to emit data to server
        this.socket.emit(event, encryptedData)

    }

    /*
        Function which recieves data from server
        decrypts the message and updates the state of the game
    */
    recieveDataFromServer(data) {
        var game = utils.decryptMessage(data);
        this.updateState(game);
    }

}
readline.question("Input address: ", (address) => {
    new Game(address);
});