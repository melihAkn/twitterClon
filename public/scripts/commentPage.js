//http://localhost:3000/jitter/linuxDeneme/659068da5b20f7ed5344aaec"

const splitURL = document.URL.split("/");
const url = splitURL[5]
console.log(url)
const getCommentData = async _ => {
    const commentId = {
        url
    }
    console.log(commentId)
    const getCommentDataURL = "/jitter/commentData";
    const commentBox = document.getElementById('comment-box');
    fetch(getCommentDataURL,{
        method : "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify(commentId)

    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
        //getting jitter data
        commentBox.innerHTML = "";
        commentBox.innerHTML = `
            <div class="card">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">${data.ownerOfJitterUsername}</p>
            <p class="subtitle is-6">@${data.ownerOfJitterUsername}</p>
          </div>
        </div>
    
        <div class="content">
            ${data.jitterTextContent}
         <div>
          
                <p class="buttons">
      <button type="button" class="button is-small likeButton" id="likeButton" disabled>
        <p>like ${data.likeCount}</p>  
      </button>
        <button type="button" class="button is-small commentButton" id="commentButton" disabled>
        <p>comment ${data.jitterComment.length}</p> 
      </button>
        <button type="button" class="button is-small reJitterButton" id="reJitterButton" disabled>
        <p>reJitter  ${data.repostCount}</p>
      </button>

      
       
      <time datetime="2016-1-1"> ${data.createdAt}</time>
    </p>
    </div>
    
      </div>
    
    </div>
    <section>
    <div id="addCommentDiv">
      <textarea name="" id="commentText" cols="100" rows="2" required ></textarea>
      <button type="button" id="addCommentButton">comment</button>
  
    </div>
  
  </section>
        <br>
        <section id="comments"> 
        
        </section>

    </div><!--card finish there -->
    <br>
            `  
        const commentText = document.getElementById('commentText')
        const addComment = document.getElementById('addCommentButton')
        
        addComment.addEventListener('click', _ => {
            if(commentText.value === ""){
                alert("jitter content cannot be empty")
            }else{
                console.log(commentText.value)
                const addCommentURL = "/user/addComment"
                const commentData = {
                    jitterId : commentId.url,
                    comment : commentText.value
                }
                //send comment
                fetch(addCommentURL,{
                    method : "POST",
                    headers : {
                        "Content-Type": "application/json"
                    },
                    body : JSON.stringify(commentData)
                })
                .then(response => response.json())
                .then(data => {
                    location.reload()
                })
                .catch(e => console.log(e))

            }
            


        })
        

        //adding comments
        const comments = document.getElementById('comments')
        data.jitterComment.forEach(comment => {
            comments.innerHTML += `

            <div class="card">
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                  </figure>
                </div>
                
                <div class="media-content">
                 
                  <p class="title is-4">${comment.ownerOfCommnet} </p>
                  <p class="subtitle is-6">@${comment.ownerOfCommnet}</p>
                </div>
              </div>
          
              <div class="content">
                  ${comment.commnetText}
               <div>
               
                      <p class="buttons">
                      <!-- 
            <button class="button is-small likeButton" id="likeButton">
              <p>like ${data.likeCount}</p>  
            </button>
              <button type = "button"  class="button is-small commentButton" id="commentButton" >
              <p>comment ${data.jitterComment.length}</p> 
            </button>
              <button class="button is-small reJitterButton" id="reJitterButton">
              <p>reJitter  ${data.repostCount}</p>
            </button>
            -->
            <time datetime="2016-1-1"> ${data.createdAt}</time>
          </p>
          </div>
          
            </div>
          
          </div>

      
          </div><!--card finish there -->
            
            `
     





        });
    
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


document.addEventListener('DOMContentLoaded',async function (){
    await getCommentData()
})