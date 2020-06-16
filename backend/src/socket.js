

export const socket = (server) => {
   
    const io = require('socket.io').listen(server);

    io.on("connection", (socket) => {
        console.log("New client connected");

        socket.on('join', (data)=>{
            console.log(data)
            socket.join(data.username)
        });

        socket.on("disconnect", () => {
            socket.leave
            console.log("Client disconnected");
          
        });
    });

  
    return io
}
