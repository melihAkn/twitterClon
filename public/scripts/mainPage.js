const getUserTokenURL = "/user/getUserToken";
let token;
//redirecting user if login credentials are wrong
//because some times in backend res.redirect('/) doesn't work I dont know why
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
const getAllTweetsURL = "/user/getAllJitters";
const sendTweetButton = document.getElementById('sendTweetButton');
const getJitters = (url = "/user/getAllJitters") => {
    getAllTweetOrUserFollowedTweets = "/user/getAllJitters"
    const timeline = document.getElementById('timeline');
    fetch(url)
    .then(response => response.json())
    .then(data => {
        timeline.innerHTML = "";
        data.forEach(jitterData => {
            timeline.innerHTML += `
            <div class="card">
      <div class="card-content">
      <button type = "button" class="followButton" id="followButton"> follow </button>
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
      <button class="button is-small likeButton" id="likeButton">
        <p>like ${jitterData.likeCount}</p>  
      </button>
        <button class="button is-small commentButton" id="commentButton">
        <p>comment ${jitterData.jitterComment.length}</p> 
      </button>
        <button class="button is-small reJitterButton" id="reJitterButton">
        <p>reJitter  ${jitterData.repostCount}</p>
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
    })
    .then( _ => {
        const likeButton = document.querySelectorAll('.likeButton');
        const commentButton = document.querySelectorAll('.commentButton');
        const rejitterButton = document.querySelectorAll('.reJitterButton');
        const followButton = document.querySelectorAll('.followButton');
        followButton.forEach(followButtons => {
            followButtons.addEventListener('click', _ => {
                const username = followButtons.parentElement.childNodes[3].children[1].children[1].firstChild.nodeValue.replace('@','')
                const followedUser = {
                    username
                }
                        if (followButtons.classList.contains('unfollow')) {
                            //unfollow 
                            const unfollowURL = '/user/unfollowUser'
                            fetch(unfollowURL,{
                                method : 'POST',
                                headers : {
                                    "Content-Type": "application/json",
                                },
                                body : JSON.stringify(followedUser)
                            })
                            .then(response => response.json())
                            .then(data => {
                            })

                            followButtons.textContent = "follow";
                            followButtons.classList.remove('unfollow');
                        } else {
                            //follow
                            const followURL = '/user/followUser'
                            fetch(followURL,{
                                method : 'POST',
                                headers : {
                                    "Content-Type": "application/json",
                                },
                                body : JSON.stringify(followedUser)
                            })
                            .then(response => response.json())
                            .then(data => {
                                if(data.message == "user followed"){
                                    followButtons.textContent = "followed";
                                    followButtons.classList.add('unfollow');
                                }else{
                                    alert(data.message)
                                }
                            })
                        }
            })
        })

        likeButton.forEach(likeButtons => {
            likeButtons.addEventListener('click',_ => {
                //jitter text have many spaces then delete it 
                
                let jitterTextArray = likeButtons.parentElement.parentElement.parentElement.childNodes[0].nodeValue.split(' ')
                for (let e = 0; e < 12; e++) {
                    jitterTextArray.shift()
                    if(e <=8){
                        jitterTextArray.pop()
                    }
                }
                let jitterText = jitterTextArray.join(" ").replace('\n','')
                let jitterOwnerUsername = likeButtons.parentElement.parentElement.parentElement.parentElement.childNodes[3].children[1].children[1].firstChild.nodeValue.replace('@','')
                let jitterJSON = {
                    jitterText,
                    jitterOwnerUsername
                }
                const likeButtonURL = "/user/likeAndUnlikeJitter"
                fetch(likeButtonURL,{
                    method : "POST",
                    headers : {
                        "Content-Type": "application/json",
                    },
                    body : JSON.stringify(jitterJSON)
                })
                .then(response => response.json())
                .then(data => {
                    getJitters()
                })
                .catch(e => console.log(e))
            })
        })

        commentButton.forEach(commentButtons => {
            
            commentButtons.addEventListener('click', _ => {
                const jitterTextArray = commentButtons.parentElement.parentElement.parentElement.childNodes[0].nodeValue.split(' ')
                for (let e = 0; e < 12; e++) {
                    jitterTextArray.shift()
                    if(e <=8){
                        jitterTextArray.pop()
                    }
                }
                let jitterText = jitterTextArray.join(" ").replace('\n','')
                const username = commentButtons.parentElement.parentElement.parentElement.parentElement.childNodes[3].childNodes[3].childNodes[3].childNodes[0].nodeValue.replace('@','')
                const jitter = {
                    jitterOwnerUsername : username,
                    jitterTextContent : jitterText
                }
    
                const getJitterIdURL = '/comments/getId'
                fetch(getJitterIdURL,{
                    method : "POST",
                    headers : {
                        "Content-Type": "application/json"
                    },
                body : JSON.stringify(jitter)
                })
                .then(response => response.json())
                .then(data => {
                    window.location.href = `/jitter/${jitter.jitterOwnerUsername}/${data.jitterId}`
                    
                })
                .catch(e => console.log(e))
            })
        })
        rejitterButton.forEach(rejitterButtons => {
            rejitterButtons.addEventListener('click', _ => {
                const rejiiterButtonURL = "/user/rejitter";

                let jitterTextArray = rejitterButtons.parentElement.parentElement.parentElement.childNodes[0].nodeValue.split(' ')
                for (let e = 0; e < 12; e++) {
                    jitterTextArray.shift()
                    if(e <=8){
                        jitterTextArray.pop()
                    }
                }
                let rejitterTweetText = jitterTextArray.join(" ").replace('\n','')
                let rejitterTweetUsername = rejitterButtons.parentElement.parentElement.parentElement.parentElement.childNodes[3].children[1].children[1].firstChild.nodeValue.replace('@','')
                let jitterJSON = {
                    rejitterTweetText,
                    rejitterTweetUsername
                }
                   //add rejitter
                   fetch(rejiiterButtonURL,{
                    method : "POST",
                    headers : {
                        "Content-Type": "application/json",
                    },
                    body : JSON.stringify(jitterJSON)
                })
                .then(response => response.json())
                .then(data => {
                    //add to classlist rejitter
                    rejitterButtons.classList.add('rejitter');
                    getJitters()
                    if(data.rejittered){
                   
                    }else{
                        alert(data.message)
                    }
                })
                .catch(e => console.log(e))
            })
        });
    })
    .catch(e => console.log(e))
}
const sendJitter = _ => {
    
const tweet = document.getElementById('tweet');
if(tweet.value == ""){
    alert('jitter content cant be empty')
}else{


const sendTweetURL = "/user/publishJitter";
    fetch(sendTweetURL,{
        method : "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body : JSON.stringify({tweet : tweet.value})
})
    .then(response => response.json())
    .then(data => {
        tweet.value = ""
        getJitters()
    }).catch(e => console.log(e))
}//else statement finish here

}

const followedUsersJitterLink = document.getElementById('followedUserJitters')
const followedUsersJitters = _ => {
    const followedUsersJittersURL = "/user/followedUsersJitters"
    fetch(followedUsersJittersURL)
    .then(response => response.json())
    .then(data => {
        getJitters("/user/followedUsersJitters")
    })
    .catch(e => console.log(e))
}
followedUsersJitterLink.addEventListener('click',followedUsersJitters)

const logoutLink = document.getElementById('logout')
const logout = _ => {
    const logoutURL = "/user/logout"
    fetch(logoutURL)
    .then(response => {

        if (response.ok) {
            return response.json();
        }

        throw new Error("Logout failed");
    })
    .then(data => {
        window.location.href = "/login";
    })
    .catch(e => console.log(e));
}
const userProfilePageLİnk = document.getElementById('userProfile')
const userProfilePage = _ => {
    fetch('/user/username')
    .then(response => response.json())
    .then(data => {
        window.location.href = `/user/profile/${data.username}`
    })
    .catch(error => {
        console.log(error)
    })


}
userProfilePageLİnk.addEventListener('click',userProfilePage)
sendTweetButton.addEventListener('click',sendJitter);

logoutLink.addEventListener('click',logout)

document.addEventListener('DOMContentLoaded',async function(){
    await getUserToken()
    const getAllTweetsURL = "/user/getAllJitters";
    getJitters(getAllTweetsURL);
});
