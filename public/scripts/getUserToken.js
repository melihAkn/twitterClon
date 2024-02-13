//redirecting user if login credentials are wrong
//because some times in backend res.redirect('/) doesn't work I dont know why

const getUserTokenURL = "/user/getUserToken";
const getUserToken =async _ => {
fetch(getUserTokenURL)
.then(response => {
    if(response.redirected == true){
        document.location.href = "/login"
        return
    }else{
        return response.json()
    }
})
.then(data => {
    if(data.token == undefined){
        document.location.href = "/login"
    }
    token = data.token;
})
.catch(e => console.log(e));
}
document.addEventListener('DOMContentLoaded',async function(){
await getUserToken()
});

console.log("bir kez mi calisiyor")
