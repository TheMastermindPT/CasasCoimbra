require('./main');
require('../views/login.hbs');
const cookies = require('js-cookie');

$(document).ready(() => {
    let auth = cookies.get('auth');
    if (auth === '0' || auth == '1') {
        $('.login__form').append(`<p class="login__status">Invalid credentials...</p>`);
        auth = cookies.remove('auth');
    }
});
