const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
    }});

// app.use(express.static(path.join(__dirname, 'public')));

var gest_in_progress = false;
var lastX = 0;
var lastY = 0;
var lastZ = 0;

var lastRoll = 0;
var lastPitch = 0;
var lastYaw = 0;

app.use('/', express.static(path.join(__dirname, 'www')));

let visSocket;

io.on('connection', (socket) => {
  console.log(`socket connected ${socket.id}`);

  socket.on("COM_CONNECTED", (data) => {
    //console.log(data);
    visSocket = socket;
  });

  socket.on("ACC_DATA", (data) => {
    //console.log(data);

    if (visSocket) visSocket.emit("ACC_DATA", data);
  });

  socket.on("ORIENTATION_DATA", (data) => {
    //console.log(data);
    //console.log(eval_Gesture(data))
    if (visSocket) visSocket.emit("ORIENTATION_DATA", data);
  });

  socket.on("CURRENT_MODE", (data) => {
    //console.log(data);
    if (visSocket) visSocket.emit("CURRENT_MODE", data);
  });
  
});

app.listen(5501, () => {
  console.log(`Server start in port : 5501`)
})

server.listen(3000, () => {
  console.log("Server listening...");
});


function eval_Position(position) {
  //cambiar este if de un igual estricto a un rango de valores
  if (position.x === 0 && position.y === 0 && position.z === 0) {
    gest_in_progress = false;
    return;
  }
  deltaX = position.x - lastX;
  deltaY = position.y - lastY;
  deltaZ = position.z - lastZ;

  lastX = position.x;
  lastY = position.y;
  lastZ = position.z;

  return { deltaX, deltaY, deltaZ };
}


function eval_Gesture(angles) {
  

  deltaRoll = angles.roll - lastRoll;
  deltaPitch = angles.pitch - lastPitch;
  deltaYaw = angles.yaw - lastYaw;

  lastRoll = angles.roll;
  lastPitch = angles.pitch;
  lastYaw = angles.yaw;

  return { deltaRoll, deltaPitch, deltaYaw };  
}

