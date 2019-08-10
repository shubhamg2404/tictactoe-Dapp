function yesAndNoValidator(string) {
    if (typeof string == "string" && string.toLocaleLowerCase()[0] == "y") {
        return true;
    }
    return false;
}
function positiveNumberValidator(number) {
    number = +number;
    if (number && number > 0) {
        return true;
    }
    return false;
}

/*
    Funtion to check if user has valid input
    :Returns bool: true if input is vaild false otherwise
*/

function boardIndexValidator(index, board) {
    index = +index;
    if (!index) return false; // Condition to check if user input is number
    if (!(index > 0 && index < 10)) return false; // Condiiton to check if user has input valid index
    if (board[index - 1]) return false; // Condition to check if given index is empty

    return true;
}

module.exports.yesAndNoValidator = yesAndNoValidator;
module.exports.positiveNumberValidator = positiveNumberValidator;
module.exports.boardIndexValidator = boardIndexValidator;