//module
const express = require("express")
const socketio = require("socket.io")
const http = require("http")

//function
const {userJoin, getRoomUser, getCurrentUser, userLeave} = require("./utils/users")
const formateMessage = require("./utils/messages")
//const getRoomUser = require("./utils/users")

//server connection
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const boatName = "Masai server";

io.on("connection",(socket)=>{

    console.log("one client joined");

    socket.on("joinRoom",({username, room})=>{
        //console.log(socket.id,username,room);

        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        //welcome current user

        socket.emit("message",formateMessage(boatName,"welcome to masai Server"))
        //brodcast to other users
        socket.broadcast.to(user.room).emit("message", formateMessage(boatName, `${user.username} has join the chat`))

        // Get all room user
         io.to(user.room).emit("roomUsers", {
            room: user.room, users: getRoomUser(user.room)
         })
    })


    socket.on("chatMessage",(msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message",formateMessage(user.username,msg))
    })

    socket.on("disconnect",()=>{
        const user = userLeave(socket.id)
        io.to(user.room).emit("message",formateMessage(boatName,`${user.username} has left the chat`))

        //get all room user
        io.to(user.room).emit("roomUsers",{
            room: user.room, users: getRoomUser(user.room)
        })
    })

})


const PORT = 8080;
server.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})