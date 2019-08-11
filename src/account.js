const ethereumjs = require("ethereumjs-abi");
const Web3 = require('web3');
var web3 = new Web3('http://127.0.0.1:7545');

class Account {

    constructor(account) {
        this.account = null;
        this.address = null;
        if (account) {
            this.account = account;
            this.address = account.address;
        }
    }

    createAccountWithPrivateKey(key) {
        if (!key && typeof key != "string") throw Error("Invalid Key");
        this.account = web3.eth.privateKeyToAccount(key);
        this.address = this.account.address;
    }
    createNewAccount() {
        this.account = web3.eth.accounts.create();
        this.address = this.account.address;
    }

    generateHash(message) {
        if(typeof message == "object"){
            message = JSON.stringify(message);
        }
        return '0x' + ethereumjs.soliditySHA3(
            ['string'],
            [String(message)]
        ).toString('hex');
    }

    hashAndSignMessage(message) {
        var hash = this.generateHash(message);
        return this.account.sign(hash).signature;
    }

}

module.exports = Account;