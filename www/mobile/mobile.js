const socket = io();

let currMode = "mando";
let accelerometer;
let absOrientation;

async function toggleModes() {
  switch (currMode) {
    case "mando":
        currMode = "control";
        document.querySelector("#mando").style.display = "none";
        document.querySelector("#temporizador").style.display = "none";
        document.querySelector("#control").style.display = "block";
    case "control":
        currMode = "temporizador";
        document.querySelector("#mando").style.display = "none";
        document.querySelector("#temporizador").style.display = "block";
        document.querySelector("#control").style.display = "none";
    case "temporizador":
        currMode = "mando";
        document.querySelector("#mando").style.display = "block";
        document.querySelector("#temporizador").style.display = "none";
        document.querySelector("#control").style.display = "none";
    }
  document.documentElement.requestFullscreen();
  await screen.orientation.lock("portrait");
  socket.emit("CURRENT_MODE", currMode);
  if (accelerometer) accelerometer.start();
  if (absOrientation) absOrientation.start();
} 

document.body.addEventListener("click", toggleModes);


if ('Accelerometer' in window) {
  try {
    accelerometer = new Accelerometer({ frequency: 10 });
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
    absOrientation = new AbsoluteOrientationSensor({ frequency: 10 });

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