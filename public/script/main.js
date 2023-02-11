
const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector(".chat-messages")
const roomName = document.getElementById("room-name")
const userList = document.getElementById("users")


const urlparam =new URLSearchParams(window.location.search)

const username = urlparam.get("username");
const room = urlparam.get("room")

//console.log(username,room)

const socket = io("http://localhost:8080/",{transports:["websocket"]})

socket.emit("joinRoom",{username,room});

socket.on("message",(msg)=>{
    outputMessage(msg)
    // console.log(msg.text);
    // console.log(msg.username);
    // console.log(msg.time);
})

socket.on("roomUsers",({room, users})=>{
    outputRoomName(room)
    outputRoomUsers(users)
})

//get message and send
chatForm.addEventListener("submit",(e)=>{
    e.preventDefault()

    let msg = e.target.elements.msg.value;

    msg = msg.trim()

    if(!msg){
        return false;
    }

    socket.emit("chatMessage",msg);

    e.target.elements.msg.value = "";
    e.target.elements.msg.focus()
})


//output message
function outputMessage(message){
    const div = document.createElement("div");
    div.classList.add("message");

    const p = document.createElement("p")
    p.classList.add("meta");

    p.innerText = message.username;

    p.innerHTML += `<span>${message.time}</span>`;

    div.appendChild(p)

    const para =document.createElement("p")

    para.classList.add("text");
    para.innerText = message.text;

    div.appendChild(para);

    chatMessages.appendChild(div)
}

function outputRoomName(room){
    roomName.innerText = room
}

function outputRoomUsers(users){
    userList.innerHTML = ""
    users.forEach(user => {
        const li = document.createElement("li")
        li.innerText = user.username
        userList.appendChild(li)
    });
}

// prompt

document.getElementById("leave-btn").addEventListener("click",(e)=>{
    const leaveRoom = confirm("Are you sure you want to leave the chatroom")

    if(leaveRoom){
        window.location.href = "./index.html"
    }
})