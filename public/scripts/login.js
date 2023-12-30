const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', e => {
    const loginURL = '/login';
    const loginFormData = new FormData(loginForm);
    console.log(loginFormData);
    fetch(loginURL,{
        method : "POST",
        headers : {
            "Content-Type": "multipart/form-data"
        },
        body : JSON.stringify(loginFormData)
    }).then(data => {
        console.log(data);
    })


});