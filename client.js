const io = require('socket.io-client')


var socket = io.connect("http://localhost:4000");
socket.emit('chat', {
    message: "shubham has joined",
    handle: null
})

socket.on('chat', function (data) {
    console.warn(data);
})

for (var i = 0; i < 10; i++) {
    socket.emit('chat', {
        message: "shubham has joined",
        handle: null
    })
}
