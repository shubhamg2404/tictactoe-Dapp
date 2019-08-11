const ethereumjs = require('ethereumjs-abi');
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
    Function to generate SHA3 of a string
    :Param gameObjectString: game object stringified
    :Returns: Hash of the input string
*/
function generateHash(gameObjectString){
    const hash = '0x'+ ethereumjs.soliditySHA3(
        ['uint256'],
        [String(gameObjectString)]
    ).toString('hex');
    return hash;
}



module.exports.encryptMessage = encryptMessage;
module.exports.decryptMessage = decryptMessage;
module.exports.generateHash = generateHash;
