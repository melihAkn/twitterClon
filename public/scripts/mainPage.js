const getUserTokenURL = "/user/getUserToken";
let token;
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

const tweetsTimeLine = document.getElementById('timeline');
const sendTweetButton = document.getElementById('sendTweetButton');



const sendTwit = _ => {
const tweet = document.getElementById('tweet').value;
const sendTweetURL = "/user/sendTweet";
console.log(tweet);
    fetch(sendTweetURL,{
        method : "GET",
        headers : {
            authorization : `Bearer ${token}`
    },
        body : tweet
})
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })




}
sendTweetButton.addEventListener('click',sendTwit);
console.log(tweetsTimeLine);










document.addEventListener('DOMContentLoaded',async function(){
    await getUserToken();


});