
/*
const socket = io('http://localhost:3001');
    
const randomNumber = Math.floor(Math.random() * 1000)
socket.emit('joinRoom', { roomID: randomNumber, token });
socket.on('newNotification', (data) => {

  

  
});


*/
const searchUserInput = document.getElementById('searchUserInput')
const searchUserButton = document.getElementById('searchUser')

searchUserButton.addEventListener('click', _ => {
    console.log(searchUserInput.textContent)
    const searchUserURL = "user/searchUser"
    fetch(searchUserURL,{
        method : "POST",
        headers : {
            "Content-Tpye" : "application/json"
        },
        body : JSON.stringify(searchUserInput.textContent)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(error => console.log(error))


})

