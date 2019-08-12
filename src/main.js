const utils = require("./utils");
const validators = require('./validators');
const constants = require("./constants");
const Account = require("./account");
const Game = require('./game');
const StateContract = require('./contract/contract');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

/*
    Function to take user input
    :Param question: strign to display to the user
    :Param validator: Function to check if given input is valid or not
    :Retruns: Promise
*/

function genericInputFunction(question, validator) {
    var retValue = new Promise((resolve, reject) => {
        readline.question(question, (input) => {
            if (validator) {
                if (validator(input)) {
                    resolve(input);
                } else {
                    console.warn("Invalid Input!");
                    resolve(genericInputFunction(question, validator));
                }
            } else {
                resolve(input);
            }

        })
    })
    return retValue;
}

async function main(){
    var userInputObj = {
        account:new Account(),
        newGame:false,
        rounds:0,
        bet:0,
        gameId:null,
        contract:new StateContract()
    }

    var createAccount = await genericInputFunction(constants.AccountInputMessage,validators.stringInputValidator);
    if(validators.yesAndNoValidator(createAccount)){ // Create New Account
        userInputObj.account.createNewAccount();
        
    }else{
        var privateKey = await genericInputFunction(constants.PrivateKeyInputMessage,validators.privateKeyValidator);
        userInputObj.account.createAccountWithPrivateKey(privateKey);
    }
    var gameType = await genericInputFunction(constants.GameTypeInputMessage,validators.stringInputValidator);
    if(validators.yesAndNoValidator(gameType)){ // Create New Game
        userInputObj.rounds = await genericInputFunction(constants.RoundsInputMessage,validators.positiveNumberValidator);
        userInputObj.bet = await genericInputFunction(constants.BetInputMessage,validators.positiveNumberValidator);
        userInputObj.contractAddress = await userInputObj.contract.deployContract(); // Deploying State Contract
    }else{
        userInputObj.gameId = await genericInputFunction(constants.GameIdInputMessage);
    }
    console.warn(userInputObj.contract.address);
    new Game(userInputObj,readline);
}

main();