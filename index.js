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

var last_gest;
var lastX = 0;
var lastY = 0;
var lastZ = 0;

var baseRoll;
var basePitch;
var baseYaw;

var shaking = false;
var timer = null;

const options = {
  threshold: 7.5
};

app.use('/', express.static(path.join(__dirname, 'www')));


let visSocket;

io.on('connection', (socket) => {
  console.log(`socket connected ${socket.id}`);

  socket.on("COM_CONNECTED", (data) => {
    console.log(data);
    visSocket = socket;
  });

  socket.on("ACC_DATA", (data) => {
    let new_data;
    new_data = eval_Position(data);
    if (visSocket) visSocket.emit("ACC_DATA", new_data);
  });

  socket.on("ORIENTATION_DATA", (data) => {
    //console.log(data);
    //console.log(eval_Gesture(data))
    let new_data;
    new_data = eval_Gesture(data);
    if (visSocket) visSocket.emit("ORIENTATION_DATA", new_data);
  });

  socket.on("CURRENT_MODE", (data) => {
    //console.log(data);
    if (visSocket) visSocket.emit("CURRENT_MODE", data);
  });
  socket.on("CALIBRAR", (data) => {
    console.log(data.roll, data.pitch, data.yaw);
    baseRoll = data.roll;
    basePitch = data.pitch;
    baseYaw = data.yaw;
  
  });

  setInterval(() => {
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
  //cambiar este if de un igual estricto a un rango de valores
  shakeCheck(position);
  if (shaking === true) {
    return { deltaX: position.x, deltaY: position.y, deltaZ: position.z, text : "shaking" };
      }
  return { deltaX: position.x, deltaY: position.y, deltaZ: position.z, text : "not shaking" };
}


function eval_Gesture(angles) {

  if ((baseRoll === undefined) || (basePitch === undefined) || (baseYaw === undefined))  {
    baseRoll = angles.roll;
    basePitch = angles.pitch;
    baseYaw = angles.yaw;
  }

  let roll = angles.roll - baseRoll;
  let pitch = angles.pitch - basePitch;
  let yaw = angles.yaw - baseYaw;
  console.log(roll, pitch, yaw);
  if (pitch > 275 && pitch < 355) {
    last_gest = "pitch up";
    return { roll: roll, pitch : pitch, yaw : yaw, text : last_gest}
  }
  if (pitch > 25 && pitch < 80) {
    last_gest = "pitch down";
    return { roll: roll, pitch : pitch, yaw : yaw, text : last_gest}
  }
  if (roll > -84 && roll < -40) {
    last_gest = "roll left";
    return { roll: roll, pitch : pitch, yaw : yaw, text : last_gest}
  }
  if (roll > -315 && roll < -265) {
    last_gest = "roll right";
    return { roll: roll, pitch : pitch, yaw : yaw, text : last_gest}
  }

  last_gest = "resting";
  return { roll: roll, pitch : pitch, yaw : yaw, text : last_gest} 
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
        console.log('shake');
        shaking = true;
        //document.body.style.backgroundColor = "red";
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }
  } else {
    if (shaking) {
      shaking = false;
      timer = setTimeout(() => {
        console.log("stop");
        //document.body.style.backgroundColor = "white";
      }, 500);
    }
  }

  lastX = acc.x;
  lastY = acc.y;
  lastZ = acc.z;

}
