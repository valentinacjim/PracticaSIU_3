const socket = io();

socket.on("connect", function(){
    socket.emit("COM_CONNECTED");
    socket.on("mode", function(data){
    });
    socket.on("operation", function(data){
    });
  })