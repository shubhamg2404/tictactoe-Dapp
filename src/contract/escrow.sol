pragma solidity ^0.5.0;

contract Escrow{

    address player1Address;
    address player2Address;
    uint playerCount = 0;
    mapping(address => uint) tokens;

    constructor() public payable{
        player1Address = msg.sender;
        playerCount++;
    }

    function player2Join() public payable{
        player2Address = msg.sender;
        playerCount++;
    }

    function isGameReady() public view returns(bool){
        require(playerCount == 2,'Game is not ready yet');
        return true;
    }

    function buyToken() public payable{
        require(msg.value > 0,"invalid value");
        tokens[msg.sender] += msg.value*1000;
    }

    function getTokenValue() public pure returns(string memory){
        return "1 ETH = 1000 game Tokens";
    }

    function getBalance() public view returns(uint){
        return tokens[msg.sender];
    }

}