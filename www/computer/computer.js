//import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("COM_CONNECTED", "Computer connected");
    }
);


var musicPlaying = document.getElementById("video");
var progreso = document.getElementsByClassName('progreso')[0];
let tiempo = document.getElementsByClassName('pro')[0];
let dur = document.getElementsByClassName('dur')[0];

async function player(video) {
    document.querySelector(".wrapper").style.display = "none";
    document.querySelector(".player").style.display = "block";
    document.querySelector("#video").src = video;
    // document.querySelector("#video").play();
}

document.querySelector("#barra").addEventListener('click',(e)=>{

    // Mostrar progreso
    let anchoprogresoval = document.querySelector("#barra").clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = musicPlaying.duration;
    musicPlaying.currentTime = (clickedOffSetX / anchoprogresoval) * songDuration;

    play = play === false;
    // reproduccion();
})

musicPlaying.addEventListener('timeupdate', (e)=>{
    // Actualizar progreso
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let anchoprogreso = (currentTime/duration)*100;
    progreso.style.width = anchoprogreso + '%';

    musicPlaying.addEventListener("loadeddata", ()=>{
        let audioDuration = musicPlaying.duration;

        let totalMin = Math.floor(audioDuration/60);
        let totalSec = Math.floor(audioDuration%60);
        if (totalSec<10){
            dur.innerHTML = totalMin + ":0" + totalSec;
        } else {
            dur.innerHTML = totalMin + ":" + totalSec;
        }});

    let currentMin = Math.floor(currentTime/60);
    let currentSec = Math.floor(currentTime%60);

    if (currentSec<10){
        tiempo.innerHTML = currentMin + ":0" + currentSec;
    } else {
        tiempo.innerHTML = currentMin + ":" + currentSec;
    }
})