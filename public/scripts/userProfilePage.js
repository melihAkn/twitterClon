const userProfileSection = document.getElementById('userProfileSection')
const userJitterSection = document.getElementById('userJitterSection')
const username = window.location.href.split('/').pop()
const getUserInfos = async _ => {
  const originalUsername = {username}
    const getUserInfosURL = "/user/getUserInfos"
    fetch(getUserInfosURL,{
      method : "POST",
      headers : {
        "Content-Type": "application/json",
      },
      body : JSON.stringify(originalUsername)
    })
    .then( response => response.json())
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
            <input type = "button" value = "follow" id="followUser">
          </div>
          <div id="buttons">

            <button id="myJitters" class="button is-small">jitters</button>
            <button id="myLikedJitters" class="button is-small"> liked jitters</button>
            <button id="myRejitteredJitters" class="button is-small"> rejittered jitters</button>
            

            <button id="followedUsers" class="button is-small"> followed users</button>
            <button id="followerUsers" class="button is-small"> follower users</button>
            <button id="updateUserInfos" class = "button is-small"> updateInfos </button>
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
        const followUserButton = document.getElementById('followUser')
        const followedUsersButton = document.getElementById('followedUsers')
        const followerUsersButton = document.getElementById('followerUsers')
        const updateUserInfosButton = document.getElementById('updateUserInfos')
        followUserButton.addEventListener('click', _ => {

          const username = window.location.href.split('/').pop()
          console.log(username)
          const userObject = {username}
          const followURL = '/user/followUser'
          fetch(followURL,{
            method : 'POST',
            headers : {

              "Content-Type": "application/json",
              },
            body : JSON.stringify(userObject)
          })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            if(data.message == "user followed"){
              followUserButton.textContent = "followed";
              window.location.reload()
            }else{
              alert(data.message)
            }
          })
        })
        fetch('/user/username')
        .then(response => response.json())
        .then(data => {
          if(data.username === username){
            followUserButton.remove()
          }
        }).catch(e => console.log(e))
       
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
                          <button class="button is-small reJitterButton" class="reJitterButton" id="reJitterButton">
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
                .then(_ => {
                  const rejitterButtons = document.querySelectorAll('.reJitterButton')
                  fetch("/user/username")
                  .then(response => response.json())
                  .then(data => {
                    if(data.username !== username){
                      rejitterButtons.forEach(e => {
                        e.disabled = true
                      })
                    }
                  })
                  .catch(e => console.log(e))
                  const removeRejiiterButtonURL = "/user/removeRejitter";
                  rejitterButtons.forEach(rejitterButton => {
                    rejitterButton.addEventListener('click', _ => {
                      //getting jitter text and owner username
                      let jitterTextArray = rejitterButton.parentElement.parentElement.parentElement.childNodes[0].textContent.trim()
                      let rejitterTweetUsername = rejitterButton.parentElement.parentElement.parentElement.parentElement.parentElement.childNodes[1].childNodes[1].childNodes[3].children[1].textContent.replace('@','')
                      let jitterJSON = {
                          jitterTextArray,
                          rejitterTweetUsername
                      }
                      fetch(removeRejiiterButtonURL,{
                        method : "POST",
                        headers : {
                          "Content-Type": "application/json"
                        },
                        body : JSON.stringify(jitterJSON)
                      })
                      .then(response => response.json())
                      .then(data => {
                        if(!data.error){
                          window.location.reload()
                        }
                        
                      })
                      .catch(e => console.log(e))

                    })
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
                  <input type="button" id="unfollowUser"class="button is-small unfollowUser" value="unfollow"></input>
                </div>
                
            </div>
              </div>
              `
          })
        })
          .then(_ => {
            const unfollowButtons = document.querySelectorAll('.unfollowUser')
            fetch("/user/username")
            .then(response => response.json())
            .then(data => {
              if(data.username !== username){
                unfollowButtons.forEach(e => {
                  e.remove()
                })
              }else{
                unfollowButtons.forEach(unfollowButton => {
              
                  unfollowButton.addEventListener('click', _ => {
                    const thisUserShouldBeUnfollow = unfollowButton.parentElement.childNodes[3].childNodes[1].textContent
                    const usernameJSON = {
                      thisUserShouldBeUnfollow,
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
                      location.reload()
                    })
                    .catch(e => console.log(e))
                  })
                })
              }
            })
            .catch(e => console.log(e))
 
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

        updateUserInfosButton.addEventListener('click', _ => {
          const userUpdateInfosURL = "/user/getUserInfosForUpdateInfos"
          fetch(userUpdateInfosURL)
          .then(response => response.json())
          .then(data => {
            function formatDate(dateString) {
              const date = new Date(dateString);
              const year = date.getFullYear();
              let month = (date.getMonth() + 1).toString().padStart(2, '0');
              let day = date.getDate().toString().padStart(2, '0');
              return `${year}-${month}-${day}`;
            }
            userJitterSection.innerHTML = `
            <iframe name="votar" style="display:none;"></iframe>
            <form id="updateForm" class="is-centered " target = "votar"  >

            <p>name: </p>
              <label for="name"></label>
              <input type="text" name="name" id="name" class="input" placeholder="visible name" value="${data.name}" required><br>
       
          
            <p>email: </p>
              <label for="email"></label>
              <input type="email" name="email" id="email" class="input" placeholder="email" value="${data.email}" required><br>
       
            <p>phoneNumber: </p>
              <label for="phoneNumber"></label>
              <input type="text" name="phoneNumber" id="phoneNumber" class="input" placeholder="phone number" value="${data.phoneNumber}" required><br>
       
            <p>date of birth: </p>
              <label for="dateOfBirth"></label>
              <input type="date" name="dateOfBirth" id="dateOfBirth" class="input" value="${formatDate(data.dateOfBirth)}" required><br>
            
            <p>current password: * </p>
              <label for="currentPassword"></label>
              <input type="password" name="currentPassword" id="currentPassword" class="input" required><br>
              <p> if dont want to update your password keep it blank</p>
            <p>new password: </p>
              <label for="newPassword"></label>
              <input type="password" name="newPassword" id="newPassword" class="input" ><br>
            
            <p>new password again: </p>
              <label for="newPasswordAgain"></label>
              <input type="password" name="newPasswordAgain" id="newPasswordAgain" class="input" ><br>
        
               <button class="button" id="updateButton"  is-rounded"> UPDATE INFOS</button>
       
             </form>
            
            `
          })
          .then( _ => {
            //sending the formData
            const updateForm = document.getElementById("updateForm")
            const currentPasswordInput = document.getElementById('currentPassword')
            const newPasswordInput = document.getElementById('newPassword')
            const newPasswordAgainInput = document.getElementById('newPasswordAgain')

            function controlTyping() {
              if(newPasswordInput.value.length > 0 || newPasswordAgainInput.value.length > 0){
                newPasswordInput.required = true
                newPasswordAgainInput.required = true
              }
            }
            newPasswordInput.addEventListener('input',controlTyping)
            newPasswordAgainInput.addEventListener('input',controlTyping)

            updateForm.addEventListener('submit', _ => {
              const updateFormData = new FormData(updateForm)
              console.log(updateFormData)
              const newPasswordValue = newPasswordInput.value;
              const newPasswordAgainValue = newPasswordAgainInput.value;
          
              if (newPasswordValue !== newPasswordAgainValue) {
                  alert("passwords are not equal please enter again");
              } else {

                  const updateUserInfosData = {
                    name : updateFormData.get('name'),
                    email : updateFormData.get('email'),
                    phoneNumber : updateFormData.get('phoneNumber'),
                    dateOfBirth : updateFormData.get('dateOfBirth'),
                    password : updateFormData.get('currentPassword'),
    
                  }
                  console.log(updateUserInfosData)
                  if(newPasswordValue.length > 0 && newPasswordAgainValue.length > 0){
                    updateUserInfosData.newPassword = newPasswordValue
                    updateUserInfosData.newPasswordAgain = newPasswordAgainValue
                  }
                  console.log(updateUserInfosData)
                  const updateUserInfosURL = "/user/updateUserInfos"
                  fetch(updateUserInfosURL , {
                    method : "POST",
                    headers : {
                      "Content-Type" : "application/json"
                    },
                    body : JSON.stringify(updateUserInfosData)
                    
                  })
                  .then(response => response.json())
                  .then(data => {
                    console.log(data)
                    if(data.updated == false){
                      alert(data.message)
                    }else{
                      alert(data.message)
                
                    }
                    newPasswordInput.value = ""
                    newPasswordAgainInput.value = ""
                    currentPasswordInput.value = ""
                  })
                  .catch(e => console.log(e))
                  console.log("tiklandi")
              }
            })
          })
          .catch(e => console.log(e))
        })
    })
    .catch(e => {
      console.error(e)
    })
}

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
logoutLink.addEventListener('click',logout)



document.addEventListener('DOMContentLoaded',async  _ => {
    await getUserInfos()

})




