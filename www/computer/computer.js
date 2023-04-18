//import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("COM_CONNECTED", "Computer connected");
    }
);


function player(video) {
    document.querySelector(".wrapper").style.display = "none";
    document.querySelector(".player").style.display = "block";
    document.querySelector("#video").src = video;
    document.querySelector("#video").play();
}
