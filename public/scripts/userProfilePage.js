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
            <button id="myComments"> my comments</button>
            <button id="myLikedJitters"> liked jitters</button>
            <button id="myRejitteredJitters"> rejittered jitters</button>
            

            <button id="followedUsersJitters"> followed users jitters</button>
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
        const myCommentsButton = document.getElementById('myComments')
        const myLikedJittersJittersButton = document.getElementById('myLikedJitters')
        const myRejitteredJittersButton = document.getElementById('myRejitteredJitters')

        const FollowedUsersJittersButton = document.getElementById('followedUsersJitters')
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
        /*
        myCommentsButton.addEventListener('click', _ => {
            data.publishedJitters.forEach(e => {
                //
                userJitterSection.innerHTML = `
                
                
                
                
                
                `
            });
        })*/
        myLikedJittersJittersButton.addEventListener('click', _ => {
            data.likedJitters.forEach(jitter => {
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
            });
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
                    console.log(repostedJitter)
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
                          <p>comment ${repostedJitterData.jitterComment}</p> 
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




                
        })/*
        FollowedUsersJittersButton.addEventListener('click', _ => {
            data.publishedJitters.forEach(e => {
                //followed users dizisini gonderip sorguyu yap
                userJitterSection.innerHTML = `
                
                
                
                
                
                `
            });
        })*/
        followedUsersButton.addEventListener('click', _ => {
            data.followed.forEach(e => {
                
                userJitterSection.innerHTML = `
                
                
                
                
                
                `
            });
        })
        followerUsersButton.addEventListener('click', _ => {
            data.followers.forEach(e => {
                
                userJitterSection.innerHTML = `
                
                
                
                
                
                `
            });
        })

    })
    .catch(e => console.error(e))
}







document.addEventListener('DOMContentLoaded',async  _ => {
    await getUserInfos()



})




