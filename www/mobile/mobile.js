const socket = io("http://localhost:3000");

var currMode;
let accelerometer;
let absOrientation;

let mando = document.querySelector("#mando");
let temporizador = document.querySelector("#temporizador");
let ajustes = document.querySelector("#ajustes");
let inicio_div = document.querySelector(".inicio");
let calibrar_btn = document.querySelector("#calibrar");


async function inicio (){
  document.documentElement.requestFullscreen();
  await screen.orientation.lock("portrait");
  inicio_div.style.display = "none";
  document.querySelector(".modo").style.display = "block";
  currMode = "mando";
  socket.emit("CURRENT_MODE", currMode);
  if (accelerometer) accelerometer.start();
  if (absOrientation) absOrientation.start();
}

async function toggleModes (){ 
  switch (currMode) {
    case "mando":
        mando.style.display = "none";
        temporizador.style.display = "none";
        ajustes.style.display = "block";
        currMode = "ajustes";
        calibrar_btn.style.display = "block";
        break;

    case "ajustes":
        currMode = "temporizador";
        mando.style.display = "none";
        temporizador.style.display = "block";
        ajustes.style.display = "none";
        calibrar_btn.style.display = "none";

        break;
    case "temporizador":
        currMode = "mando";
        mando.style.display = "block";
        temporizador.style.display = "none";
        ajustes.style.display = "none";
        calibrar_btn.style.display = "none";

        break;
    }
  socket.emit("CURRENT_MODE", currMode);
} 

inicio_div.addEventListener("click", inicio);
mando.addEventListener("click", toggleModes);
temporizador.addEventListener("click", toggleModes);
ajustes.addEventListener("click", toggleModes);
document.querySelector("#calibrar").addEventListener("click", calibrar);

function calibrar() { 
 let quat = new Float32Array(4);
 quat = absOrientation.quaternion;
 const angles = toEulerRollPitchYaw(quat);
 socket.emit("CALIBRAR",{roll: angles.roll, pitch: angles.pitch, yaw: angles.yaw});
}
   

 if ('Accelerometer' in window) {
   try {
     accelerometer = new Accelerometer({ frequency: 2 });
     accelerometer.onerror = (event) => {
       // Errores en tiempo de ejecución
       if (event.error.name === 'NotAllowedError') {
         alert('Permission to access sensor was denied.');
       } else if (event.error.name === 'NotReadableError') {
         alert('Cannot connect to the sensor.');
       }
     };
     accelerometer.onreading = (e) => {
       socket.emit("ACC_DATA", { x: accelerometer.x, y: accelerometer.y, z: accelerometer.z });
     };


   } catch (error) {
     // Error en la creación del objeto
     if (error.name === 'SecurityError') {
       alert('Sensor construction was blocked by the Permissions Policy.');
     } else if (error.name === 'ReferenceError') {
       alert('Sensor is not supported by the User Agent.');
     } else {
       throw error;
     }
   }
 }


 if ('AbsoluteOrientationSensor' in window) {
   try {
     absOrientation = new AbsoluteOrientationSensor({ frequency: 2 });

     absOrientation.onreading = (e) => {
       const quat = e.target.quaternion;
       const angles = toEulerRollPitchYaw(quat);
       socket.emit("ORIENTATION_DATA", { roll: angles.roll, pitch: angles.pitch, yaw: angles.yaw});
     };


   } catch (err) {
   }
 }

 function toEulerRollPitchYaw(q) {

  const roll  = Math.atan2(2 * q[1] * q[3] + 2 * q[0] * q[2], 1 - 2 * [1] * q[1] - 2 * q[2] * q[2]) * 180 / Math.PI;
  const pitch = Math.atan2(2 * q[0] * q[3] + 2 * q[1] * q[2], 1 - 2 * q[0] * q[0] - 2 * q[2] * q[2]) * 180 / Math.PI;
  

  const siny_cosp = 2 * (q[3] * q[2] + q[0] * q[1]);
  const cosy_cosp = 1 - 2 * (q[1] * q[1] + q[2] * q[2]);
  const yaw = Math.atan2(siny_cosp, cosy_cosp) * 180 / Math.PI;

   return { roll, pitch, yaw };
 }
