const contractMeta = require('./contract_meta')
const Web3 = require('web3');
let selectedHost = 'http://127.0.0.1:7545';
var web3 = new Web3(new Web3.providers.HttpProvider(selectedHost));
class GameContract{
    constructor(address){

        if(!address){
            this.deployContractGameContract();
        }
        this.interface = null;
        this.otherPlayerAddress = null;
    }

    setOtherPlayerAddress(address){
        this.otherPlayerAddress = address;
    }

    deployContractGameContract(){
        // console.warn(web3);

        // var Contract = new web3.eth.Contract(contractMeta.abi); 
        // this.interface = Contract.new({
        //     data:contractMeta.bytecode.object,
        //     gas:7e6
        // },(err,result)=>{
        //     if(!result.address){
        //         console.warn("wait until the block is mined with the contract creation transaction");
        //     }else{
        //         console.warn("here's the contract address jsut deployed",result.address);
        //     }
        // })
    }

    getTokenBalance(){
        return this.retriveTokenBalance(this.address);
    }
    getOtherPlayersTokenBalance(){
        if(!this.otherPlayerAddress) throw Error("Invalid address");
        return this.retriveTokenBalance(this.otherPlayerAddress);
    }
    
    retriveTokenBalance(address){
        return 0;
    }

    settleScore(){

    }
}
new GameContract();
//console.warn(web3.eth);