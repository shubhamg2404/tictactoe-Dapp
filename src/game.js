const utils = require("./utils");
const io = require('socket.io-client');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})


class Game {
    constructor(address) {
        //this.players = players;
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.isYourTurn = false;
        this.address = address;
        this.winner = undefined;
        this.socket = io.connect("http://localhost:4000");
        this.gameId = null;
        this.addListeners();
    }

    /*
        Function to add listeners for websockets
        :Event start: is called when game is started
        :Event play: is event which is called when user takes his turn
        :Event join: is called when player wants to join
    */
    addListeners() {
        console.warn("Waiting For server");
        this.socket.on("start", (isYourTurn, gameId) => {
            this.start(isYourTurn, gameId)
        });
        this.socket.on("play", (param) => {
            this.recieveDataFromServer(param)
        });
        this.socket.emit("join", this.address);
    }

    /*
        Function to do initial setup
        setup your turn, gameId and your inital isgn
    */
    start(isYourTurn, gameId) {
        this.isYourTurn = isYourTurn;
        this.gameId = gameId;
        console.warn("Game has started", this.sign);
        this.sign = (this.isYourTurn) ? "X" : "O";
        this.displayBoard();
    }
    /*
        Function to display to board to console
    */
    displayBoard() {
        console.clear();
        var stringToPrint = '';
        for (var i = 0; i < 9; i++) {
            if (this.board[i]) {    // Index has some value 
                stringToPrint += "\t" + this.board[i] + "\t";
            } else {                // Empty slot
                stringToPrint += "\t\t";
            }
            stringToPrint += "|"
            if ((i + 1) % 3 == 0) {
                stringToPrint += "\n";
            }

        }
        console.warn(stringToPrint);

        if (this.winner) {
            console.warn(`Winner is player: ${this.winner}`);
            return;
        }

        if (this.isYourTurn && !this.winner) {
            this.takeUserInput();
        }
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
            console.warn(string);
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
     Function to take user input only called when it is user's turn
    */
    takeUserInput() {
        readline.question(`Input Index: `, (index) => {
            index = +index;
            if (this.checkIfValidInput(index)) {
                this.updateBoard(index);
                // readline.close();
            } else {
                console.warn("Invalid Input!");
                this.takeUserInput();
            }
        })
    }

    /*
        Function to update board position when user takes his turn
        Checked if winner is descided and sends data to server
        :Param index: index of board already validated
    */
    updateBoard(index) {
        this.board[index - 1] = this.sign;
        //this.isYourTurn = false;
        this.checkWinner();
        this.displayBoard();
        if (!this.winner) {
            this.displayWaiting();
        }

        this.sendDataToServer();
    }

    /*
        Function to display waiting message
    */
    displayWaiting() {
        console.log("Waiting for opponent....");
    }

    /*
        Funtion to check if user has valid input
        :Returns bool: true if input is vaild false otherwise
    */

    checkIfValidInput(index) {
        if (!index) return false; // Condition to check if user input is number
        if (!(index > 0 && index < 10)) return false; // Condiiton to check if user has input valid index
        if (this.board[index - 1]) return false; // Condition to check if given index is empty

        return true;
    }

    /*
        Function to construct the gameObject to send to server
        Encrypts data and sends data to server
    */
    sendDataToServer() {
        var gameObject = {
            address: this.address,
            board: this.board,
            winner: this.winner,
            gameId: this.gameId
        }
        var encryptedData = utils.encryptMessage(gameObject);

        // Write logic to emit data to server
        this.socket.emit("play", encryptedData)

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

readline.question(`Input Address: `, (address) => {
    new Game(address);

})

