const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', e => {
    const registerFormData = new FormData(registerForm);
    const registerURL = '/register';
    /*
    const formData = {
        username : registerFormData.get('username'),
        email : registerFormData.get('email'),
        phoneNumber : registerFormData.get('phoneNumber'),
        dateOfBirth : registerFormData.get('dateOfBirth'),
        password : registerFormData.get('password')

    }*/
    fetch(registerURL,{
        method : "POST",
        headers : {
            "Content-Type": "multipart/form-data"
        },
        body : JSON.stringify(registerFormData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(e => console.log(e))
})