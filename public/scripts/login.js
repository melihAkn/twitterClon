console.log('sdasds');

const loginForm = document.getElementById('loginForm');
console.log(loginForm);

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const loginURL = '/login';
    const loginFormData = new FormData(loginForm);
    console.log(loginFormData);
    fetch(loginURL);


});