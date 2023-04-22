// import jquery from "jquery";
//import { io } from "socket.io-client";

var action;
var mode;
var location_to = "home";
var locations = ["home", "music", "games", "animation"];
// var current_location = 0;
var videos = [["home1", "home2", "home3", "home4", "home5", "home6"], 
              ["music1", "music2", "music3", "music4", "music5", "music6"], 
              ["games1", "games2", "games3", "games4", "games5", "games6"], 
              ["animation1", "animation2", "animation3", "animation4", "animation5", "animation6"]];
var ajustes = ["volume", "brightness", "contrast"];
var ajustes_icon = ["icono_volume", "icono_brightness", "icono_contrast"];
var select;
var ajuste;
var ajuste_icon;
var select_img;
var brillo = 1;
var contraste = 1;
var fav = 0;

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("COM_CONNECTED", "Computer connected");

    
    socket.on("ACTION", (data) => {
       action = data;
    //    document.getElementById("roll").innerHTML = orientationData;
    });
    socket.on("CURRENT_MODE", (data) => {
        mode = data;
        // document.getElementById("modo").innerHTML = mode;
    });

});

window.onload = function () {
    select = document.querySelector("#home1");
    select.className = "selector";
    console.log(select.id);
    select_img = document.querySelector("#home1 img");
    ajuste = document.querySelector(".volume");
    ajuste_icon = document.querySelector("#icono_volume");
    ajuste_icon.style.color = "#6d00a2";
    
};
setInterval(() => {
    // console.log(action);
    if(mode=="mando"){
        close_settings();
        switch (action) {
            case "pitch up":
                console.log("pitch up");
                if(document.querySelector("#video").src == "http://127.0.0.1:5500/www/computer/computer.html"){
                    section_navegate_up();
                }else{
                    pause();
                }
                break;
            case "pitch down":
                console.log("pitch down");
                if(document.querySelector("#video").src == "http://127.0.0.1:5500/www/computer/computer.html"){
                    section_navegate_down();
                }
                break;
            case "roll left":
                console.log("roll left");
                if(document.querySelector("#video").src == "http://127.0.0.1:5500/www/computer/computer.html"){
                    section_navigate_left();
                }
                else{
                    back();
                }
                break;
            case "roll right":
                console.log("roll right");
                if(document.querySelector("#video").src == "http://127.0.0.1:5500/www/computer/computer.html"){
                    section_navigate_right();
                }
                else{
                    next();
                }
                break;
            
            case "shake":
                console.log("shake");
                if(document.querySelector("#video").src == "http://127.0.0.1:5500/www/computer/computer.html"){
                //      console.log("resting");
                    // select = document.querySelector(".thumbnail .hover")
                    let video = select_img.src;
                    // (this).children('img').src;
                    video = video.replace(".png", ".mp4");
                    console.log(video);
                        // .slice(0, -4) + ".mp4";
                    ;
                    player(video);
                }else{
                    if (fav==0) {
                        like.className = "fa-solid fa-heart";
                        fav = 1;
                    } else {
                        like.className = "fa-regular fa-heart";
                        fav = 0;
                    }
                }

            case "resting":
                console.log("resting");
                if(document.querySelector("#video").src == "http://127.0.0.1:5500/www/computer/computer.html"){
                }else{
                // // document.querySelector("#video").src = "../../images/computer/music1_busted.mp4";
                // // console.log(document.querySelector("#video").src);
                play();
                }
                break;

            // añadir resaltar botones
            }
    } else if(mode=="ajustes"){
        settings();
        switch (action) {
            case "pitch up":
                console.log("pitch up");
                for (let i = 0; i < ajustes.length; i++) {
                    if (ajuste.className == ajustes[i]) {
                        ajuste_icon.style.color = "white";
                        // console.log(ajuste.className);
                        if (ajuste.className == "volume") {
                            ajuste = document.querySelector(".contrast");
                            ajuste_icon = document.querySelector("#icono_contrast");
                            ajuste_icon.style.color = "#6d00a2";
                        } else {
                            ajuste = document.querySelector("." + ajustes[i - 1]);
                            ajuste_icon = document.querySelector("#" + ajustes_icon[i-1]);
                            ajuste_icon.style.color = "#6d00a2";
                        }
                        
                        break;
                    }
                }
                break;
            case "pitch down":
                console.log("pitch down");
                for (let i = 0; i < ajustes.length; i++) {
                    if (ajuste.className == ajustes[i]) {
                        ajuste_icon.style.color = "white";
                        // console.log(ajuste.className);
                        if (ajuste.className == "contrast") {
                            ajuste = document.querySelector(".volume");
                            ajuste_icon = document.querySelector("#icono_volume");
                            ajuste_icon.style.color = "#6d00a2";
                        } else {
                            ajuste = document.querySelector("." + ajustes[i + 1]);
                            ajuste_icon = document.querySelector("#" + ajustes_icon[i+1]);
                            ajuste_icon.style.color = "#6d00a2";
                        }
                        
                        
                        break;
                    }
                    
                }
                break;
            case "roll left":
                console.log("roll left");
                switch (ajuste.className) {
                    case "volume":
                        volume_down();
                        break;
                    case "brightness":
                        brightness_down();
                        break;
                    case "contrast":
                        contrast_down();
                        break;
                }
                break;
            case "roll right":
                console.log("roll right");
                console.log(ajuste.className);
                switch (ajuste.className) {
                    case "volume":
                        volume_up();
                        break;
                    case "brightness":
                        brightness_up();
                        break;
                    case "contrast":
                        contrast_up();
                        break;
                }

            
        }
    } else if(mode=="temporizador"){
        close_settings();
        switch (action) {}
    }


}, 1000);




//CONTROLES DE REPRODUCCION DE VIDEO
var like = document.getElementById("like");
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
    play();
}

function next() {
    document.querySelector("#video").currentTime += 10;
    play();
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
    pause();
}

function fullscreen() {
    document.querySelector("#video").requestFullscreen();
}

function close_settings() {
    document.querySelector(".video-options").style.display = "none";
}

function volume_up() {
    document.querySelector("#video").volume += 0.1;
    document.querySelector(".volume").setAttribute("value", document.querySelector("#video").volume);
}

function volume_down() {
    document.querySelector("#video").volume -= 0.1;
    document.querySelector(".volume").setAttribute("value", document.querySelector("#video").volume);
}   

function brightness_up() {
    brillo += 0.1;
    document.querySelector("#video").style.filter = "brightness(" + (brillo) + ")";
    document.querySelector(".brightness").setAttribute("value", brillo);
}

function brightness_down() {
    brillo -= 0.1;
    document.querySelector("#video").style.filter = "brightness(" + (brillo) + ")";
    document.querySelector(".brightness").setAttribute("value", brillo);
}

function contrast_up() {
    contraste += 0.1;
    document.querySelector("#video").style.filter = "contrast(" + (contraste) + ")";
    document.querySelector(".contrast").setAttribute("value", contraste);
}

function contrast_down() {
    contraste -= 0.1;
    document.querySelector("#video").style.filter = "contrast(" + (contraste) + ")";
    document.querySelector(".contrast").setAttribute("value", contraste);
}

function section_navegate_down(){
    for (let i = 0; i < locations.length; i++) {
        console.log(location_to);
        if(locations[i] == location_to){ //music
            if (i == locations.length-1){
                location_to = locations[0];
                
            }else{
                location_to = locations[i+1]; //home
            }
        break;
        } 
    }
    // console.log(location_to);
    location.hash = "#"+location_to;
    select.className = "thumbnail";
    select = document.getElementById(location_to+"1");
    
    select.className = "selector";
    select_img = document.querySelector(".selector img");
    // console.log(select_img);
    // console.log(location.hash)
}

function section_navegate_up(){
    console.log(select);
    for (let i = 0; i < locations.length; i++) {
        if(locations[i] == location_to){ //music
            if (i == 0){
                location_to = locations[locations.length-1];
                
            }else{
                location_to = locations[i-1]; //home
            }
        }
    }
    location.hash = "#"+location_to;
    console.log(location_to)
    select.className = "thumbnail";
    select = document.getElementById(location_to+"1");
    
    select.className = "selector";
    select_img = document.querySelector(".selector img");
    console.log(select_img);
}

function section_navigate_left(){
    let nest_select = "";

    for (let i = 0; i < videos.length; i++) {
        for (let j = 0; j < videos[i].length; j++) {
            if(videos[i][j] == select.id){ //home2
                if (j == 0){
                    nest_select = videos[i][videos[i].length-1];
                    
                }else{
                    nest_select = videos[i][j-1]; //home1
                }
            }
        }
    }
    select.className = "thumbnail";
    console.log(nest_select);
    select = document.getElementById(nest_select);
    select.className = "selector";
    select_img = document.querySelector(".selector img");
    console.log(select_img);
}

function section_navigate_right(){
    let nest_select = "";
    for (let i = 0; i < videos.length; i++) {
        for (let j = 0; j < videos[i].length; j++) {
            if(videos[i][j] == select.id){ //home2
                if (j == videos[i].length-1){
                    nest_select = videos[i][0];
                    
                }else{
                    nest_select = videos[i][j+1]; //home1
                }
            }
        }
    }
    select.className = "thumbnail";
    select = document.getElementById(nest_select);
    
    select.className = "selector";
    select_img = document.querySelector(".selector img");
    console.log(select_img);
    // select_img = document.querySelector("selector img");
}

// function section_navigation_select(){}



var timeout;

document.querySelector(".video-container").addEventListener("mousemove", function() {
    
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