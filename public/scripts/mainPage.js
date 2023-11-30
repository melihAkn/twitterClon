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

const sendTweetButton = document.getElementById('sendTweetButton');

const getJitters = _ => {
    const getAllTweetsURL = "/user/getAllJitters"
    const timeline = document.getElementById('timeline')
    console.log(timeline)
    fetch(getAllTweetsURL)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        timeline.innerHTML = ""
        data.forEach(jitterData => {
            timeline.innerHTML += `
            <div class="card">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">${jitterData.ownerOfJitterUsername}</p>
            <p class="subtitle is-6">@${jitterData.ownerOfJitterUsername}</p>
          </div>
        </div>
    
        <div class="content">
            ${jitterData.jitterTextContent}
         <div>
          
                <p class="buttons">
      <button class="button is-small">
        <p>like </p>  ${jitterData.repostCount}
      </button>
        <button class="button is-small">
        <p>comment </p> ${jitterData.likeCount}
      </button>
        <button class="button is-small">
        <p>reTweet </p> ${" "+jitterData.jitterComment.length}
      </button>
       
      <time datetime="2016-1-1"> ${jitterData.createdAt}</time>
    </p>
    </div>
      </div>
    
    </div>
    </div><!--card finish there -->
    <br>
            `  
        });
        
    }).catch(e => console.log(e))

}

const sendJitter = _ => {
const tweet = document.getElementById('tweet').value;
const sendTweetURL = "/user/publishJitter";
console.log(tweet);
    fetch(sendTweetURL,{
        method : "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body : JSON.stringify({tweet : tweet})
})
    .then(response => response.json())
    .then(data => {
        console.log(data)
        getJitters()
    }).catch(e => console.log(e))




}
const logoutLink = document.getElementById('logout')
console.log(logoutLink)
const logout = _ => {
    const logoutURL = "/user/logout"
    fetch(logoutURL)
    .then(response => {
        console.log(response);

        if (response.ok) {
            return response.json();
        }

        throw new Error("Logout failed");
    })
    .then(data => {
        console.log(data);
        window.location.href = "/login";
    })
    .catch(e => console.log(e));
}

sendTweetButton.addEventListener('click',sendJitter);

logoutLink.addEventListener('click',logout)



document.addEventListener('DOMContentLoaded',async function(){
    await getUserToken();
    getJitters()


});