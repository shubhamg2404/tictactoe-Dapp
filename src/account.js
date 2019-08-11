const ethereumjs = require("ethereumjs-abi");
const Web3 = require('web3');
var web3 = new Web3('http://127.0.0.1:7545');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const validator = require('./validators');

class Account {

    constructor(account) {
        this.account = account;
        this.address = account.address;
    }

    createAccountWithPrivateKey(key) {
        if (!key && typeof key != "string") throw Error("Invalid Key");
        return account = web3.eth.privateKeyToAccount(key);
    }

    generateHash(message) {
        return '0x' + ethereumjs.soliditySHA3(
            ['uint256'],
            [String(message)]
        ).toString('hex');
    }

    hashAndSignMessage(message) {
        var hash = this.generateHash(message);
        return this.account.sign(hash);
    }

    getBalance() {

    }

}


function createOrImportAccount() {
    readline.question("Do you want to create account or import old accout? [(Y) to create new/(N) to import old ] : ", (choice) => {
        if (validator.yesAndNoValidator(choice)) {
            var newAccount = web3.eth.accounts.create();
            createAccountAndInjectIntoGame(newAccount);
        } else {
            takePrivateKeyInput();
        }
    })
}
function takePrivateKeyInput() {
    readline.question("Input Private Key: ", (privateKey) => {
        if (validator.privateKeyValidator(privateKey)) {
            var importedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
            createAccountAndInjectIntoGame(importedAccount);
        }else{
            console.warn("Invalid private key");
            takePrivateKeyInput();
        }

    })
}


function createAccountAndInjectIntoGame(web3Account) {
    var account = new Account(web3Account);

}

createOrImportAccount();