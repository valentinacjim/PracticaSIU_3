const socket = io();

socket.on("connect", function(){
    socket.emit("COM_CONNECTED");
    socket.on("ACC_DATA", function(data){
        console.log(data);
    });
    socket.on("ORIENTATION_DATA", function(data){
        console.log(data);
    });
  })