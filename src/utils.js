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

module.exports.encryptMessage = encryptMessage;
module.exports.decryptMessage = decryptMessage;