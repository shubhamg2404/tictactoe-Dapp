/*
    Function to decrypt Message from server
*/
function decryptMessage(data) {
    var gameObject = JSON.parse(data);
    return gameObject;
}


/*
    Function to encrupt Message and sign it
*/
function encryptMessage(messageObject) {
    var retValue = JSON.stringify(messageObject);
    return retValue;
}

/*
    Function to generate a random number
    :Returns: Number
*/
function generateRandomId() {
    return Math.floor(Math.random() * 1000000000000000);
}

/*
    Function to check if the winner is decided
*/
function checkWinner(board) {
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
            string += board[combination[innerIndex]];
        }
        if (string === oWinner || string === xWinner) return true;
    }
    return false;
}


module.exports.encryptMessage = encryptMessage;
module.exports.decryptMessage = decryptMessage;
module.exports.generateRandomId = generateRandomId;
module.exports.checkWinner = checkWinner;