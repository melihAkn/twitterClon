const userProfileSection = document.getElementById('userProfileSection')
const userJitterSection = document.getElementById('userJitterSection')


const getUserInfos = async _ => {
    const getUserInfosURL = "/user/getUserInfos"
    fetch(getUserInfosURL)
    .then(response => response.json())
    .then(data => {
        userProfileSection.innerHTML = `
        <div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">${data.username}</p>
              <p>follower count: ${data.followers.length}</p>
              <p>followed count: ${data.followed.length}</p>
            </div>
          </div>
          <div>

            <button id="myJitters"> my jitters</button>
            <button id="myLikedJitters"> liked jitters</button>
            <button id="myRejitteredJitters"> rejittered jitters</button>
            

            <button id="followedUsers"> followed users</button>
            <button id="followerUsers"> follower users</button>
  
          </div>
      </div>
        </div>
        `
        return data
    })
    .then(data => {
        const myJittersButton = document.getElementById('myJitters')
        const myLikedJittersJittersButton = document.getElementById('myLikedJitters')
        const myRejitteredJittersButton = document.getElementById('myRejitteredJitters')

        const followedUsersButton = document.getElementById('followedUsers')
        const followerUsersButton = document.getElementById('followerUsers')
        
        myJittersButton.addEventListener('click', _ => {
            userJitterSection.innerHTML = ""
            data.publishedJitters.forEach(jitter => {
                userJitterSection.innerHTML += `
                <br>
                <div class="card">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-48x48">
                        <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title is-4">${data.username}</p>
                      <p class="subtitle is-6">@${data.username}</p>
                    </div>
                  </div>
              
                  <div class="content">
                      ${jitter.jitterTextContent}
                   <div>
                    
                          <p class="buttons">
                <button class="button is-small likeButton" id="likeButton" disabled>
                  <p>like ${jitter.likeCount}</p>  
                </button>
                  <button class="button is-small commentButton" id="commentButton" disabled>
                  <p>comment ${jitter.commentCount}</p> 
                </button>
                  <button class="button is-small reJitterButton" id="reJitterButton" disabled>
                  <p>reJitter  ${jitter.repostCount}</p>
                </button>
                 
              </p>
              </div>
                </div>
              
              </div>
              </div><!--card finish there -->
                      
                 `

            })


        })
     
        myLikedJittersJittersButton.addEventListener('click', _ => {
          userJitterSection.innerHTML = ""
          const userLikedJittersURL =  "/user/getUserLikedJitters"
          fetch(userLikedJittersURL,{
            method : "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(data.likedJitters)
        })
        .then(response => response.json())
        .then(data => {
          data.forEach(jitter => {
            userJitterSection.innerHTML += `
            <br>
            <div class="card">
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-4">${jitter.ownerOfJitterUsername}</p>
                  <p class="subtitle is-6">@${jitter.ownerOfJitterUsername}</p>
                </div>
              </div>
          
              <div class="content">
                  ${jitter.jitterTextContent}
               <div>
                
                      <p class="buttons">
            <button class="button is-small likeButton" id="likeButton" disabled>
              <p>like ${jitter.likeCount}</p>  
            </button>
              <button class="button is-small commentButton" id="commentButton" disabled>
              <p>comment ${jitter.jitterComment.length}</p> 
            </button>
              <button class="button is-small reJitterButton" id="reJitterButton" disabled>
              <p>reJitter  ${jitter.repostCount}</p>
            </button>
             
          </p>
          </div>
            </div>
          
          </div>
          </div><!--card finish there -->
                  
             `
          })
         
        })
        .catch(e => console.log(e))
        })

        myRejitteredJittersButton.addEventListener('click', _ => {
            userJitterSection.innerHTML = ""
            const getRejitteredJittersURL = "/user/getUserRejitteredJitters"
                fetch(getRejitteredJittersURL,{
                    method : "POST",
                    headers : {
                        "Content-Type": "application/json"
                    },
                    body : JSON.stringify(data.repostedJitters)
                }
                    )
                .then(response => response.json())
                .then(repostedJitter => {
                    repostedJitter.forEach(repostedJitterData => {
                        userJitterSection.innerHTML += `
                        <br>
                        <div class="card">
                        <div class="card-content">
                          <div class="media">
                            <div class="media-left">
                              <figure class="image is-48x48">
                                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                              </figure>
                            </div>
                            <div class="media-content">
                              <p class="title is-4">${repostedJitterData.ownerOfJitterUsername}</p>
                              <p class="subtitle is-6">@${repostedJitterData.ownerOfJitterUsername}</p>
                            </div>
                          </div>
                      
                          <div class="content">
                              ${repostedJitterData.jitterTextContent}
                           <div>
                            
                                  <p class="buttons">
                        <button class="button is-small likeButton" id="likeButton" disabled>
                          <p>like ${repostedJitterData.likeCount}</p>  
                        </button>
                          <button class="button is-small commentButton" id="commentButton" disabled>
                          <p>comment ${repostedJitterData.jitterComment.length}</p> 
                        </button>
                          <button class="button is-small reJitterButton" id="reJitterButton" disabled>
                          <p>reJitter  ${repostedJitterData.repostCount}</p>
                        </button>
                         
                      </p>
                      </div>
                        </div>
                      
                      </div>
                      </div><!--card finish there -->
                              
                    `

                    })
                   
                })
                .catch(e => console.log(e))




                
        })
        followedUsersButton.addEventListener('click', _ => {
          userJitterSection.innerHTML = ""
          const getUserFollowedUsersURL = "/user/getUserFollowedUsers"
          fetch(getUserFollowedUsersURL,{
            method : "POST",
            headers : {
              "Content-Type" : "application/json"
            },
            body : JSON.stringify(data.followed)
          })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            data.forEach(user => {
                
              userJitterSection.innerHTML += `
              <br>
              <div class="card">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-4">${user.username}</p>
                    <p>follower count: ${user.followers.length}</p>
                    <p>followed count: ${user.followed.length}</p>
                  </div>
                  <input type="button" id="unfollowUser" class="unfollowUser" value="unfollow"></input>
                </div>
                
            </div>
              </div>
              `
          })
        })
          .then(_ => {
            const unfollowButtons = document.querySelectorAll('.unfollowUser')
            console.log(unfollowButtons)
            unfollowButtons.forEach(unfollowButton => {
              
              unfollowButton.addEventListener('click', _ => {
                const username = unfollowButton.parentElement.childNodes[3].childNodes[1].textContent
                const usernameJSON = {
                  username
                }
                const unfollowUserURL = "/user/unfollowUser"
                fetch(unfollowUserURL,{
                  method : "POST",
                  headers : {
                    "Content-Type" : "application/json"
                  },
                  body :JSON.stringify(usernameJSON)
                })
                .then(response => response.json())
                .then(data => {
                  console.log(data)
                  location.reload()
                })
                .catch(e => console.log(e))
              })
            })
          })
          
          .catch(e => console.log(e))

           
        })
        followerUsersButton.addEventListener('click', _ => {
          userJitterSection.innerHTML = ""
            const followerUsersURL = "/user/getUserFollowerUsers"
            fetch(followerUsersURL,{
              method : "POST",
              headers : {
                "Content-Type" : "application/json"
              },
              body : JSON.stringify(data.followers)
            })
            .then(response => response.json())
            .then(data => {
              console.log(data)
              data.forEach(user => {
                
                userJitterSection.innerHTML += `
                <br>
                <div class="card">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-48x48">
                        <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title is-4">${user.username}</p>
                      <p>follower count: ${user.followers.length}</p>
                      <p>followed count: ${user.followed.length}</p>
                    </div>
                  </div>
                  
              </div>
                </div>
                `
  
              })
            })
            .catch(e => console.log(e))
           
        })

    })
    .catch(e => console.error(e))
}
document.addEventListener('DOMContentLoaded',async  _ => {
    await getUserInfos()

})




