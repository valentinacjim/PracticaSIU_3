const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
    }});



var upsideDown = false;
var shaking = false;

var last_gest;

var lastX = 0;
var lastY = 0;
var lastZ = 0;

var baseRoll;
var basePitch;
var baseYaw;

var timer = null;

const options = {
  threshold: 7.5
};

app.use('/', express.static(path.join(__dirname, 'www')));

let visSocket; //socket para comunicarse con el reproductor (ordenador)

io.on('connection', (socket) => {
  console.log(`socket connected ${socket.id}`);

  socket.on("COM_CONNECTED", () => {
    visSocket = socket;
  });

  //recibo datos del dispositivo
  socket.on("ACC_DATA", (data) => {
    let new_data;
    new_data = eval_Position(data);
  });

  socket.on("ORIENTATION_DATA", (data) => {
    let new_data;
    new_data = eval_Gesture(data);
  });

  socket.on("CURRENT_MODE", (data) => {
    if (visSocket) visSocket.emit("CURRENT_MODE", data);
  });
  socket.on("CALIBRAR", (data) => {
    baseRoll = data.roll;
    basePitch = data.pitch;
    baseYaw = data.yaw;
  
  });

  setInterval(() => { //envío de datos al reproductor
  if (upsideDown === true) {
    if (visSocket) visSocket.emit("ACTION", "upside_down");
    return
  }
  if (shaking === true) {
    if (visSocket) visSocket.emit("ACTION", "shake"); 
    return
  }
  if (visSocket) visSocket.emit("ACTION", last_gest);
}, 500);
});

server.listen(3000, () => {
  console.log("Server listening...");
});


function eval_Position(position) {
  
  shakeCheck(position);
  if (shaking === true) {
    return;
      }
  if (position.z < -8) {
    upsideDown = true;
    return;
  }
  upsideDown = false;
}


function eval_Gesture(angles) { //evalúa el gesto actual según los ángulos de orientación

  if ((baseRoll === undefined) || (basePitch === undefined) || (baseYaw === undefined))  {
    baseRoll = angles.roll;
    basePitch = angles.pitch;
    baseYaw = angles.yaw;
  }

  let roll = angles.roll - baseRoll;
  let pitch = angles.pitch - basePitch;
  let yaw = angles.yaw - baseYaw;

  if ((pitch > 275 && pitch < 355 ) || (pitch > -45 && pitch < -15)) {
    last_gest = "pitch up";
    return;
  }
  if ((pitch > 25 && pitch < 80) || (pitch > -342 && pitch < -275)) { 
    last_gest = "pitch down";
    return;
  }
  if ((roll > -84 && roll < -40) || (roll > 248 && roll < 320))  {
    last_gest = "roll left";
    return;
  }
  if ((roll > -315 && roll < -265) || (roll > 45 && roll < 97)) {
    last_gest = "roll right";
    return;
  }

  last_gest = "resting";
  return;
}

function shakeCheck (acc){
  const deltaX = Math.abs(lastX - acc.x); 
  const deltaY = Math.abs(lastY - acc.y);
  const deltaZ = Math.abs(lastZ - acc.z);

  if ( ((deltaX > options.threshold) && (deltaY > options.threshold)) ||
       ((deltaX > options.threshold) && (deltaZ > options.threshold)) ||
       ((deltaY > options.threshold) && (deltaZ > options.threshold))
        ) {
    if (!shaking) {
        shaking = true;

        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }
  } else {
    if (shaking) {
      shaking = false;
      timer = setTimeout(() => {
      }, 500);
    }
  }

  lastX = acc.x;
  lastY = acc.y;
  lastZ = acc.z;

}
