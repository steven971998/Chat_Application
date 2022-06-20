//node server which will handle socket io connections. //

const io = require('socket.io')(8000,{
    cors:{
        origin:'*',
    }
});

const users= {}; /* Names or id of users will be saved in this */

io.on('connection',socket =>{
    // if any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name=>{   
        // console.log("New user",name)
        users[socket.id] = name;    /* (new user's name is added into users function and an id is generated for him.) */
        socket.broadcast.emit('user-joined',name); /* when new user join, it will show to everyone else in the group that this new user has joined the chat */
    });

    //if someone sends a message broadcast it to other people.
    socket.on('send', message =>{ 
        socket.broadcast.emit('receive',{message: message, name: users[socket.id]})
    });
    
    //  if someone leaves the chat, let others know.
    socket.on('disconnect', message =>{ //disconnect is a built in event.
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });


})