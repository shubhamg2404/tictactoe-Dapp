const express = require('express');
const socket = require('socket.io');


var app = express();
var server = app.listen(4000,function(){
    console.warn("app is listeneing to requests on port 4000");
})

var io = socket(server);

io.on('connection',function(socket){
    console.log("made a socket connection");
    socket.on('chat',function(data){
        socket.emit('chat',data);
    })

})
