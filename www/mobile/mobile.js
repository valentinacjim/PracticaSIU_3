const socket = io("http://localhost:3000");

var currMode;
let accelerometer;
let absOrientation;

// console.log(document.body);
let mando = document.querySelector("#mando");
let temporizador = document.querySelector("#temporizador");
let ajustes = document.querySelector("#ajustes");

async function toggleModes (){
  console.log(currMode);
  switch (currMode) {
     case undefined:
        currMode = "mando";
    case "mando":
        // console.log(document.querySelector("#mando").style.display);
        mando.style.display = "none";
        temporizador.style.display = "none";
        ajustes.style.display = "block";
        currMode = "ajustes";
        break;
    case "ajustes":
        currMode = "temporizador";
        mando.style.display = "none";
        temporizador.style.display = "block";
        ajustes.style.display = "none";
        break;
    case "temporizador":
        currMode = "mando";
        mando.style.display = "block";
        temporizador.style.display = "none";
        ajustes.style.display = "none";
        break;
    }
  console.log(currMode, "final");
  document.documentElement.requestFullscreen();
  await screen.orientation.lock("portrait");
  socket.emit("CURRENT_MODE", currMode);
  if (accelerometer) accelerometer.start();
  if (absOrientation) absOrientation.start();
} 
mando.addEventListener("click", toggleModes);
temporizador.addEventListener("click", toggleModes);
ajustes.addEventListener("click", toggleModes);


 if ('Accelerometer' in window) {
   try {
     accelerometer = new Accelerometer({ frequency: 5 });
     accelerometer.onerror = (event) => {
       // Errores en tiempo de ejecución
       if (event.error.name === 'NotAllowedError') {
         alert('Permission to access sensor was denied.');
       } else if (event.error.name === 'NotReadableError') {
         alert('Cannot connect to the sensor.');
       }
     };
     accelerometer.onreading = (e) => {
      console.log("reading acc")
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
     absOrientation = new AbsoluteOrientationSensor({ frequency: 5 });

     absOrientation.onreading = (e) => {
       const quat = e.target.quaternion;
       const angles = toEulerRollPitchYaw(quat);
       socket.emit("ORIENTATION_DATA", { roll: angles.roll, pitch: angles.pitch, yaw: angles.yaw});
     };


   } catch (err) {
     console.log(err);
   }
 }

 function toEulerRollPitchYaw(q) {
   const sinr_cosp = 2 * (q[3] * q[0] - q[1] * q[2]);
   const cosr_cosp = 1 - 2 * (q[0] * q[0] + q[1] * q[1]);
   const roll = Math.atan2(sinr_cosp, cosr_cosp);

   const sinp = Math.sqrt(1 + 2 * (q[3] * q[1] - q[0] * q[2]));
   const cosp = Math.sqrt(1 - 2 * (q[3] * q[1] + q[0] * q[2]));
   const pitch = 2 * Math.atan2(sinp, cosp) - Math.PI / 2;

   const siny_cosp = 2 * (q[3] * q[2] + q[0] * q[1]);
   const cosy_cosp = 1 - 2 * (q[1] * q[1] + q[2] * q[2]);
   const yaw = Math.atan2(siny_cosp, cosy_cosp);

   return { roll, pitch, yaw };
 }