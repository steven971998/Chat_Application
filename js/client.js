const socket = io('http://localhost:8000');

//Get DOM elements in respective Js variables.
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
// Audio that will play on receiving messages.
var audio = new Audio('ting_ringtone.mp3')

//Function which will apend event to the container.
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left'){ /* we should get ting sound only if we receive message from others and not if we send message. */
        audio.play();
    }
}

//Ask New user for Name and let the server know.
const name = prompt("Enter your Name to join the group chat.");
socket.emit('new-user-joined', name)

//If a new user joins, receive his name from the server.
socket.on('user-joined',name =>{ /* when a new user joins his name should be shown that he has joined the chat in the right side of the chat */
    append(`${name} joined the chat`,'right')
})

// If server sends a message receive it.
socket.on('receive', data =>{ /* when we receive a chat from someone it should show on the left side of the chat. */
    append(`${data.name}: ${data.message}`,'left')
})

// If a user leaves the chat, append the info to the container.
socket.on('left', name =>{ /* when a person leaves the chat it should indicate there .  */
    append(`${name} left the chat.`,'right')
})

// If the form gets submitted, send server the message.
form.addEventListener('submit',(e)=>{
    e.preventDefault();    /* such that our page should'nt reload once we click on submit. */
    const message = messageInput.value;
    append(`You: ${message}`,'right'); /* our message will be shown on the right side. */
    socket.emit('send',message);
    messageInput.value = ''   /* After sending the message the input box should become empty. */ 
})