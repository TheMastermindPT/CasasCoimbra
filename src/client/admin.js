require('./main');
require('./popup.js');
require('../views/admin.hbs');
const cookies = require('js-cookie');
const template = require('./template');

//GLOBALS
let isAppended = false;

//Loads Homes in the Dashboard
$.ajax({
    url: `${window.location.origin}/api/casas`,
    method: 'GET'
}).then(data => {
    //Place house number in hidden input
    $('#numero').attr('value', data.length + 1);

    data.forEach((casa, index) => {
        template.templateAdmin(casa);
    });
});


$(document).ready(() => {
    //Saves Home to Database
    $('.home__wrap').on('submit', '.home__form', function (e) {
        const data = new FormData($(this)[0]);
        event.preventDefault();

        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/casas/upload`,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
        }).then(res => location.reload());
    });

    //Deletes Home from Database
    $('.home__wrap').on('click', '.home__delete', function (e) {
        const nome = $(this).closest('form').find('.home__nome').children('input').val();
        event.preventDefault();

        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/casas/delete`,
            data: {
                'nome': nome
            }
        }).then(res => location.reload());
    });

    //Uploads Temp Photo to Server and Previews Home image
    $('.home__wrap').on('change', '.foto__input', function (e) {
        const data = new FormData($(this).parents('form')[0]);
        const indexInput = $('.foto__input:not(:last)').index(this);
        event.preventDefault();
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/casas/preview`,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
        }).then(res => {
            const filename = $(this).get(0).files[0].name;
            let img = $(this).prev('label').children('img').attr('src');
            let imgPath;
            let imgName;

            //Gets the input file filename and changes the img src to preview the img
            if (img != null) {
                imgPath = img.split('/');
                imgName = imgPath[imgPath.length - 1];
                imgName = filename;
                imgPath = imgPath.splice(1, 1);
                imgPath = imgPath.join('/');
                imgPath = '/' + imgPath;
                imgPath = imgPath + '/temp' + `/${imgName}`;
            }

            if (indexInput !== -1) {
                $(this).prev('label').children('img').attr('src', imgPath);
            } else {
                imgPath = `/assets/temp/${filename}`;
                if (!isAppended) {
                    $('.home__form:last').find('svg:first').remove();
                    $('.home__form:last').find('label:first').css('border', 'none');
                    $('.home__form:last').find('label').append(`<img src="${imgPath}" alt="thumbnail">`);
                    isAppended = true;
                    return;
                }
                $('.home__form:last').find('img').attr('src', imgPath);
            }
        });
    });

    //Check if admin is logged in
    let auth = cookies.get('auth');
    if (window.location.href === 'http://localhost:3000/admin/dashboard') {
        if (auth !== '2') {
            window.location.replace('/admin/login');
        }
    }
});





