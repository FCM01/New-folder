const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server}= require("socket.io")
// const io = new Server(server)
const PORT  = process.env.PORT||3000

const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Access-Control-Allow-Origin"],
      credentials: true
    }
  });

app.get('/', (req, res) => {
  res.write(`<h1>Hello world ${PORT}</h1>`);
  res.end()
});

io.on("connection", (socket)=>{
    console.log("user connected")
    socket.on("message",(msg)=>{
        io.emit("message",msg);
    })
    socket.on("chat created",function(data){
        socket.broadcast.emit("chat made",{user:data})
    
    })
    socket.on("group chat created",function(data){
        console.log(data)
        socket.broadcast.emit("group chat made",{user:data})
    
    })
     socket.on("join", function(data){
         console.log(data)
         if (data.room != null && data.user !=null){
            socket.join(data.room);
            console.log(data.user+"user has join the room:"+data.room);
            socket.broadcast.to(data.room).emit("new user has joined",{user:data.user,message:"new user has joined "})
    
         }
         else{
    
           console.log("nul payload is being sent to socket:")
             
         }
         
     })
     socket.on("message",function(data){
         console.log(data)
         io.in(data.room).emit("new message",{user:data.user,message:data.message});
    
     })
     socket.on("leave", function(data){
       
        console.log(data.user+"left the room :"+data.room);
        socket.broadcast.to(data.room).emit("left room",{user:data.user,message:"has left the room"})
        socket.leave(data.room)
    
        
    })
})
server.listen(PORT, () => {
  console.log('listening on *:3000');
});