var Accounts = require('web3-eth-accounts');
var accounts = new Accounts('ws://localhost:7545');
var newAccount = accounts.create();
console.warn(newAccount);
var data = "shubham";
var encrypted = newAccount.encrypt(data);
console.warn(encrypted);