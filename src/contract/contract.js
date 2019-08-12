const contractMeta = require('./contract_meta')
const Web3 = require('web3');

let selectedHost = 'http://127.0.0.1:7545';
var web3 = new Web3(new Web3.providers.HttpProvider(selectedHost));
class GameContract {
    constructor(address) {
        this.address = address;
        this.instance = null;
        this.otherPlayerAddress = null;
    }

    setOtherPlayerAddress(address) {
        this.otherPlayerAddress = address;
    }

    async deployContract() {
        var accounts = await web3.eth.getAccounts();
        var gasPrice = await web3.eth.getGasPrice();
        var byteCode = contractMeta.bytecode.object;
        var abi = contractMeta.abi;
        var contractInterface = new web3.eth.Contract(abi, null, {
            data: '0x' + byteCode
        });
        var estinateGas = await contractInterface.deploy().estimateGas();
        var contractInstance = await contractInterface.deploy().send({
            from: accounts[0],
            gas: estinateGas,
            gasPrice: gasPrice
        })
        this.address = contractInstance.options.address;
        return this.address;
    }

    async loadContract(address){
        try{
            if(address){
                this.address = address;
            }
            this.instance = await new web3.eth.Contract(contractMeta.abi,this.address);
        }catch(e){

        }
    }


    getTokenBalance() {
        return this.retriveTokenBalance(this.address);
    }
    getOtherPlayersTokenBalance() {
        if (!this.otherPlayerAddress) throw Error("Invalid address");
        return this.retriveTokenBalance(this.otherPlayerAddress);
    }

    retriveTokenBalance(address) {
        return 0;
    }

    settleScore() {

    }
}

module.exports = GameContract;