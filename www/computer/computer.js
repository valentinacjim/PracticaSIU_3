//import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("COM_CONNECTED", "Computer connected");
    }
);



//CONTROLES DE REPRODUCCION DE VIDEO
var close_video = document.getElementById("close");
var back_icon = document.getElementById("back");
var next_icon = document.getElementById("next");
var play_icon = document.getElementById("play");
var pause_icon = document.getElementById("pause");
var settings_icon = document.getElementById("settings");
var fullscreen_icon = document.getElementById("icono_pantalla");

function close() {
    console.log("close");
    document.querySelector(".wrapper").style.display = "block";
    document.querySelector(".player").style.display = "none";
    document.querySelector("#video").src = "";
    document.querySelector("#video").pause();
}

function back() {
    document.querySelector("#video").currentTime -= 10;
}

function next() {
    document.querySelector("#video").currentTime += 10;
}

function play() {
    document.querySelector("#video").play();
    play_icon.style.display = "none";
    pause_icon.style.display = "block";
}

function pause() {
    document.querySelector("#video").pause();
    play_icon.style.display = "block";
    pause_icon.style.display = "none";
}

function settings() {
    document.querySelector(".video-options").style.display = "block";
}

function fullscreen() {
    document.querySelector("#video").requestFullscreen();
}

var timeout;

document.querySelector(".video-container").addEventListener("mousemove", function(event) {
    
    clearTimeout(timeout);
    document.querySelector(".video-controls").style.display = "flex";
    document.querySelector(".video-container").style.cursor = "default";
    
    timeout = setTimeout(function() {
        document.querySelector(".video-controls").style.display = "none";
        document.querySelector(".video-container").style.cursor = "none";
    }, 1000);

});



close_video.addEventListener("click", close);
back_icon.addEventListener("click", back);
next_icon.addEventListener("click", next);
play_icon.addEventListener("click", play);
pause_icon.addEventListener("click", pause);
settings_icon.addEventListener("click", settings);
fullscreen_icon.addEventListener("click", fullscreen);


//REPRODUCCION DE VIDEO
var musicPlaying = document.getElementById("video");
var progreso = document.getElementsByClassName('progreso')[0];
let tiempo = document.getElementsByClassName('pro')[0];
let dur = document.getElementsByClassName('dur')[0];

async function player(video) {
    document.querySelector(".wrapper").style.display = "none";
    document.querySelector(".player").style.display = "block";
    document.querySelector("#video").src = video;
    document.querySelector("#video").play();
    setTimeout(() => {
        if(document.querySelector(".video-controls").style.display == "flex"){
        document.querySelector(".video-controls").style.display = "none";
        document.querySelector(".video-container").style.cursor = "none";
        }
    }, 2500);
}

document.querySelector("#barra").addEventListener('click',(e)=>{

    // Mostrar progreso
    let anchoprogresoval = document.querySelector("#barra").clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = musicPlaying.duration;
    musicPlaying.currentTime = (clickedOffSetX / anchoprogresoval) * songDuration;
   
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