require('./main');
require('./popup.js');
require('../views/admin.hbs');
const cookies = require('js-cookie');
const template = require('./template');

// GLOBALS
let isAppended = false;

// Loads Homes in the Dashboard
$.ajax({
  url: `${window.location.origin}/api/casas`,
  method: 'GET'
}).then(data => {
  // Place house number in hidden input
  $('#numero').attr('value', data.length + 1);

  data.forEach(casa => {
    template.templateAdmin(casa);
  });
});

$(document).ready(() => {
  // Saves Home to Database
  $('.home__wrap').on('submit', '.home__form', function(e) {
    const data = new FormData($(this)[0]);
    e.preventDefault();

    $.ajax({
      method: 'POST',
      url: `${window.location.origin}/api/casas/upload`,
      data,
      cache: false,
      contentType: false,
      processData: false
    }).then(() => window.location.reload());
  });

  // Select division when changing select value
  $('.popup__form').on('change', '#divisao', function() {
    const idCasa = $(this)
      .parents('.popup__form')
      .data('id');

    const idDivisao = $(this)
      .find(':selected')
      .val();

    if (idDivisao !== 'create') {
      $.ajax({
        method: 'GET',
        url: `${window.location.origin}/api/casas?id=${idCasa}&div=${idDivisao}&edit`,
        dataType: 'json'
      }).then(casa => {
        console.log(casa);
        // Populate inputs with the values of the first division of the house
        $('#tipo').val(casa.divisao[0].tipo);

        casa.divisao[0].numero
          ? $('#div__numero').val(casa.divisao[0].numero)
          : $('#div__numero').val('');

        $('#descricao').val(casa.divisao[0].descricao);
        $('#preco').val(casa.divisao[0].preco);
        casa.divisao[0].disponivel
          ? $('#disponivel').prop('checked', true)
          : $('#disponivel').prop('checked', false);

        $('#quando').val(casa.divisao[0].quando);
      });
    } else if (idDivisao === 'create') {
      $(this)
        .parents('.popup__form')
        .find('input, textarea')
        .val('');

      $(this)
        .parents('.popup__form')
        .find('input[type=checkbox]')
        .prop('checked', false);
    }
  });

  // Deletes Home from Database
  $('.home__wrap').on('click', '.home__delete', function(e) {
    const nome = $(this)
      .closest('form')
      .find('.home__nome')
      .children('input')
      .val();
    e.preventDefault();

    $.ajax({
      method: 'POST',
      url: `${window.location.origin}/api/casas/delete`,
      data: {
        nome
      }
    }).then(() => window.location.reload());
  });

  // Uploads Temp Photo to Server and Previews Home image
  $('.home__wrap').on('change', '.foto__input', function(e) {
    const data = new FormData($(this).parents('form')[0]);
    const indexInput = $('.foto__input:not(:last)').index(this);
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: `${window.location.origin}/api/casas/preview`,
      data,
      cache: false,
      contentType: false,
      processData: false
    }).then(() => {
      const filename = $(this).get(0).files[0].name;
      const img = $(this)
        .prev('label')
        .children('img')
        .attr('src');
      let imgPath;
      let imgName;

      // Gets the input file filename and changes the img src to preview the img
      if (img != null) {
        imgPath = img.split('/');
        imgName = imgPath[imgPath.length - 1];
        imgName = filename;
        imgPath = imgPath.splice(1, 1);
        imgPath = imgPath.join('/');
        imgPath = `/${imgPath}`;
        imgPath = `${imgPath}/temp/${imgName}`;
      }

      if (indexInput !== -1) {
        $(this)
          .prev('label')
          .children('img')
          .attr('src', imgPath);
      } else {
        imgPath = `/assets/temp/${filename}`;
        if (!isAppended) {
          $('.home__form:last')
            .find('svg:first')
            .remove();
          $('.home__form:last')
            .find('.home__foto label')
            .css('border', 'none');
          $('.home__form:last')
            .find('.home__foto label')
            .append(`<img src="${imgPath}" alt="thumbnail">`);
          isAppended = true;
          return;
        }
        $('.home__form:last')
          .find('img')
          .attr('src', imgPath);
      }
    });
  });

  $('#fotos__divisao').on('change', function() {
    const idDivisao = $('#divisao option:selected').val();
    const numeroDivisao = $('#div__numero').val();
    const idCasa = $('.popup__form').data('id');
    const tipo = $('#tipo').val();
    const data = new FormData($(this).parent('form')[0]);

    data.append('tipo', tipo);
    data.append('idDivisao', idDivisao);
    data.append('idCasa', idCasa);
    data.append('numeroDivisao', numeroDivisao);

    $.ajax({
      method: 'POST',
      url: `${window.location.origin}/api/casas/uploadMulti`,
      data,
      cache: false,
      contentType: false,
      processData: false
    }).then(res => console.log(res));
  });

  // Check if admin is logged in
  const auth = cookies.get('auth');
  if (window.location.href === 'http://localhost:3000/admin/dashboard') {
    if (auth !== '2') {
      window.location.replace('/admin/login');
    }
  }
});