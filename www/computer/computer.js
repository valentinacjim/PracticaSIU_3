var action; // accion del mando
var mode; // modo del mando
var location_to = "home"; // localizacion a la que se quiere navegar
var locations = ["home", "music", "games", "animation"]; // localizaciones
var videos = [["home1", "home2", "home3", "home4", "home5", "home6"], 
              ["music1", "music2", "music3", "music4", "music5", "music6"], 
              ["games1", "games2", "games3", "games4", "games5", "games6"], 
              ["animation1", "animation2", "animation3", "animation4", "animation5", "animation6"]]; // videos de cada localizacion
var ajustes = ["volume", "brightness", "contrast"]; 
var ajustes_icon = ["icono_volume", "icono_brightness", "icono_contrast"];
var select; // seleccion actual de la localizacion
var ajuste; // seleccion actual de los ajustes
var ajuste_icon; // icono de la seleccion actual de los ajustes
var select_img; // imagen de la seleccion actual de la localizacion
var brillo = 1; // brillo actual
var contraste = 1; // contraste actual
var fav = 0; 
var sleep_timer; 
var timer_end; // tiempo de fin del timer
var sleep_time = 0; // tiempo de sleep
var path = "http://127.0.0.1:5500/www/computer/computer.html" // path de la pagina


// SOCKET
const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("COM_CONNECTED", "Computer connected");
    socket.on("ACTION", (data) => {
       action = data;
    });
    socket.on("CURRENT_MODE", (data) => {
        mode = data;
    });

});

// FUNCTIONS 
window.onload = function () {
    select = document.querySelector("#home1");
    select.className = "selector";
    select_img = document.querySelector("#home1 img");
    ajuste = document.querySelector(".volume");
    ajuste_icon = document.querySelector("#icono_volume");
    ajuste_icon.style.color = "#6d00a2";
    
};

// GESTURES DEPENDING ON THE MODE
setInterval(() => {
    if(mode=="mando"){
        close_settings(); // cerrar ajustes
        close_timer(); // cerrar timer
        switch (action) {
            case "pitch up":
                if(document.querySelector("#video").src == path){
                    section_navegate_up(); // navegar entre secciones HACIA ARRIBA
                }else{
                    pause(); // pausar video
                }
                break;

            case "pitch down":
                if(document.querySelector("#video").src == path){
                    section_navegate_down(); // navegar entre secciones HACIA ABAJO
                }
                break;

            case "roll left":
                if(document.querySelector("#video").src == path){
                    section_navigate_left(); // navegar entre secciones HACIA LA IZQUIERDA
                }
                else{       
                    back(); // retroceder video
                }
                break;

            case "roll right":
                if(document.querySelector("#video").src == path){
                    section_navigate_right(); // navegar entre secciones HACIA LA DERECHA
                }
                else{
                    next(); // avanzar video
                }
                break;
            
            case "shake":
                if(document.querySelector("#video").src == path){
                    // seleccionar video y reproducirlo
                    let video = select_img.src; 
                    video = video.replace(".png", ".mp4");
                    player(video);
                }else{
                    // añadir a favoritos
                    if (fav==0) {
                        like.className = "fa-solid fa-heart";
                        fav = 1;
                    } else {
                        like.className = "fa-regular fa-heart";
                        fav = 0;
                    }
                }
                break;

            case "upside_down":
                if(document.querySelector("#video").src != path){
                    close(); // cerrar video
                }
                break;

            case "resting":
                if(document.querySelector("#video").src != path){
                    play(); // reproducir video
                }
                break;
            }

    } else if(mode=="ajustes"){
        close_timer(); // cerrar timer
        settings(); // abrir ajustes
        switch (action) {
            case "pitch up":
                // subir ajuste
                for (let i = 0; i < ajustes.length; i++) {
                    if (ajuste.className == ajustes[i]) {
                        ajuste_icon.style.color = "white";
                        if (ajuste.className == "volume") {
                            ajuste = document.querySelector(".contrast");
                            ajuste_icon = document.querySelector("#icono_contrast");
                            ajuste_icon.style.color = "#6d00a2"; // resaltar icono
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
                // bajar ajuste
                for (let i = 0; i < ajustes.length; i++) {
                    if (ajuste.className == ajustes[i]) {
                        ajuste_icon.style.color = "white";
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
                // bajar nivel de ajuste
                switch (ajuste.className) {
                    case "volume":
                        volume_down(); // bajar volumen
                        break;
                    case "brightness":
                        brightness_down(); // bajar brillo
                        break;
                    case "contrast":
                        contrast_down(); // bajar contraste
                        break;
                }
                break;

            case "roll right":
                // subir nivel de ajuste
                switch (ajuste.className) {
                    case "volume":
                        volume_up(); // subir volumen
                        break;
                    case "brightness":
                        brightness_up(); // subir brillo
                        break;
                    case "contrast":
                        contrast_up(); // subir contraste
                        break;
                }
                break
        }

    } else if(mode=="temporizador"){
        close_settings(); // cerrar ajustes
        compute_remaining_time(); // calcular tiempo restante
        switch (action) {
            case "pitch up":
                if (timer_end == null){  // si no hay temporizador activo
                start_timer(); // iniciar temporizador
                }
                break;

            case "pitch down":
                stop_timer(); // parar temporizador
                break;
            
            case "roll left":    
                if (sleep_time >= 300000) {
                    sleep_time -= 300000; // restar 5 minutos
                }else{
                    sleep_time = 0;
                }
                break;

            case "roll right":
                sleep_time += 300000; // sumar 5 minutos
                break;
        }
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

function close() { // cerrar video
    document.querySelector(".wrapper").style.display = "block";
    document.querySelector(".player").style.display = "none";
    document.querySelector("#video").src = ""; // vaciar video
    document.querySelector("#video").pause(); // pausar video
}

function back() { // retroceder video
    document.querySelector("#video").currentTime -= 10;
    play();
}

function next() { // avanzar video
    document.querySelector("#video").currentTime += 10;
    play();
}

function play() { // reproducir video
    document.querySelector("#video").play();
    play_icon.style.display = "none";
    pause_icon.style.display = "block";
}

function pause() { // pausar video
    document.querySelector("#video").pause();
    play_icon.style.display = "block";
    pause_icon.style.display = "none";
}

function settings() { // abrir ajustes
    document.querySelector(".video-options").style.display = "block";
    // asignar valores de ajustes
    document.querySelector(".volume").setAttribute("value", document.querySelector("#video").volume);
    document.querySelector(".brightness").setAttribute("value", brillo);
    document.querySelector(".contrast").setAttribute("value", contraste);
    pause();
}

function fullscreen() { // pantalla completa
    document.querySelector("#video").requestFullscreen();
}

function close_settings() { // cerrar ajustes
    document.querySelector(".video-options").style.display = "none";
}

function volume_up() { // subir volumen
    if (document.querySelector("#video").volume < 1){
    document.querySelector("#video").volume += 0.1;
    document.querySelector(".volume").setAttribute("value", document.querySelector("#video").volume);
    }
}

function volume_down() { // bajar volumen
    if (document.querySelector("#video").volume > 0){
    document.querySelector("#video").volume -= 0.1;
    document.querySelector(".volume").setAttribute("value", document.querySelector("#video").volume);
    }
}

function brightness_up() { // subir brillo
    if (brillo < 1){
    brillo += 0.1;
    document.querySelector("#video").style.filter = "brightness(" + (brillo) + ")";
    document.querySelector(".brightness").setAttribute("value", brillo);
    }
}

function brightness_down() { // bajar brillo
    if (brillo > 0){
    brillo -= 0.1;
    document.querySelector("#video").style.filter = "brightness(" + (brillo) + ")";
    document.querySelector(".brightness").setAttribute("value", brillo);
    }
}

function contrast_up() { // subir contraste
    if (contraste < 1){
    contraste += 0.1;
    document.querySelector("#video").style.filter = "contrast(" + (contraste) + ")";
    document.querySelector(".contrast").setAttribute("value", contraste);
    }
}

function contrast_down() { // bajar contraste
    if (contraste > 0){
    contraste -= 0.1;
    document.querySelector("#video").style.filter = "contrast(" + (contraste) + ")";
    document.querySelector(".contrast").setAttribute("value", contraste);
    }
}

function section_navegate_down(){ //navegacion entre secciones hacia abajo
    for (let i = 0; i < locations.length; i++) {
        if(locations[i] == location_to){ 
            if (i == locations.length-1){
                location_to = locations[0]; 
            }else{
                location_to = locations[i+1]; 
            }
            break;
        } 
    }
    
    // cambiar selector
    location.hash = "#"+location_to; // cambiar url
    select.className = "thumbnail"; 
    select = document.getElementById(location_to+"1"); 
    
    select.className = "selector";
    select_img = document.querySelector(".selector img");
}

function section_navegate_up(){ //navegacion entre secciones hacia arriba
    for (let i = 0; i < locations.length; i++) {
        if(locations[i] == location_to){
            if (i == 0){
                location_to = locations[locations.length-1];
                
            }else{
                location_to = locations[i-1];
            }
            break;
        }
    }

    location.hash = "#"+location_to;
    select.className = "thumbnail";
    select = document.getElementById(location_to+"1");
    
    select.className = "selector";
    select_img = document.querySelector(".selector img");
}

function section_navigate_left(){ //navegacion entre secciones hacia la izquierda
    let nest_select = "";
    for (let i = 0; i < videos.length; i++) {
        for (let j = 0; j < videos[i].length; j++) {
            if(videos[i][j] == select.id){ 
                if (j == 0){
                    nest_select = videos[i][videos[i].length-1];
                    
                }else{
                    nest_select = videos[i][j-1]; 
                }
                break;
            }
        }
    }
    select.className = "thumbnail";
    select = document.getElementById(nest_select);

    select.className = "selector";
    select_img = document.querySelector(".selector img");
}

function section_navigate_right(){ //navegacion entre secciones hacia la derecha
    let nest_select = "";
    for (let i = 0; i < videos.length; i++) {
        for (let j = 0; j < videos[i].length; j++) {
            if(videos[i][j] == select.id){ 
                if (j == videos[i].length-1){
                    nest_select = videos[i][0];
                    
                }else{
                    nest_select = videos[i][j+1]; 
                }
                break;
            }
        }
    }
    select.className = "thumbnail";
    select = document.getElementById(nest_select);
    
    select.className = "selector";
    select_img = document.querySelector(".selector img");
}

// MANNTENER CONTROLES VISIBLES
var timeout;

document.querySelector(".video-container").addEventListener("mousemove", function() {
    
    clearTimeout(timeout); // reset timeout
    document.querySelector(".video-controls").style.display = "flex";
    document.querySelector(".video-container").style.cursor = "default";
    
    timeout = setTimeout(function() {
        document.querySelector(".video-controls").style.display = "none";
        document.querySelector(".video-container").style.cursor = "none";
    }, 1000);

});

// EVENTOS
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


async function player(video) { // reproducir video
    document.querySelector(".wrapper").style.display = "none";
    document.querySelector(".player").style.display = "block";
    document.querySelector("#video").src = video;
    document.querySelector("#video").play();
    document.querySelector("#video").volume = 0.5;
    setTimeout(() => { // mostrar controles
        if(document.querySelector(".video-controls").style.display == "flex"){
        document.querySelector(".video-controls").style.display = "none";
        document.querySelector(".video-container").style.cursor = "none";
        }
    }, 2500);
}


document.querySelector("#barra").addEventListener('click',(e)=>{ // cambiar tiempo de reproduccion
    let anchoprogresoval = document.querySelector("#barra").clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = musicPlaying.duration;
    musicPlaying.currentTime = (clickedOffSetX / anchoprogresoval) * songDuration; 
   
})

musicPlaying.addEventListener('timeupdate', (e)=>{ // Actualizar progreso
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let anchoprogreso = (currentTime/duration)*100;
    progreso.style.width = anchoprogreso + '%';

    musicPlaying.addEventListener("loadeddata", ()=>{ // duracion restante
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

/* TIMER */
function timer_set(time){ // set timer
    
    timer_end = Date.now() + time;
    sleep_timer = setTimeout(function(){
        //stop video
        if (document.querySelector("#video").src != path){
             pause();
        }

    }, time);
}
function compute_remaining_time(){ // computar tiempo restante
    let text = "";
    let minutes = "";
    let seconds = "";
    document.querySelector(".timer").style.display = "block";
    
    if (timer_end == null){ // si no hay timer
        minutes = Math.floor((sleep_time % 3600000) / 60000);
        seconds = Math.floor(((sleep_time % 360000) % 60000) / 1000);
    }
    else {
        text = timer_end - Date.now(); // tiempo restante
        if (text < 0){ // si el tiempo es menor a 0
            text = 0;
        }
        minutes = Math.floor((text % 3600000) / 60000);
        seconds = Math.floor(((text % 360000) % 60000) / 1000);    
    }

    // formateo de tiempo
    if (seconds < 10){
        seconds = "0" + seconds;
    }
    if (minutes < 10){
        minutes = "0" + minutes;
    }
    text = minutes + ":" + seconds;

    document.querySelector("#timer").innerHTML = text; // mostrar tiempo
}
function timer_clr(){ // reset timer
    clearTimeout(sleep_timer);
    sleep_time = 0;
    timer_end = null;

}

function close_timer(){ // cerrar timer
    document.querySelector(".timer").style.display = "none";
}

function start_timer(){ // iniciar timer
    timer_set(sleep_time); // set timer
    document.querySelector("#start").style.display = "none";
    document.querySelector("#stop").style.display = "block";
}

function stop_timer(){ // detener timer
    timer_clr(); // reset timer
    document.querySelector("#start").style.display = "block";
    document.querySelector("#stop").style.display = "none";
}