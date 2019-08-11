/*
    Function to check if user choice yes or not
    :Param string: input string
    :Returns bool: true if first char of the string is y false otherwise
*/

function yesAndNoValidator(string) {
    if (typeof string == "string" && string.toLocaleLowerCase()[0] == "y") {
        return true;
    }
    return false;
}

/*
    Function to check if the given number if pisitive number
    :Param number: number to check
    :Retruns bool: true if number is posiitve and greater then zero false otherwise
*/
function positiveNumberValidator(number) {
    number = +number;
    if (number && number > 0) {
        return true;
    }
    return false;
}

/*
    Function to check if input key is valid private key
    :Param key: string to be checked
    :Returns bool: true if key is find else otherwise
*/

function privateKeyValidator(key){
    if(!key && typeof key != "string") return false;
    if(key.length != 66) return false;
    return true;
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
module.exports.privateKeyValidator = privateKeyValidator;