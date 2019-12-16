require('./main');
require('./popup.js');
require('../views/admin.hbs');
const cookies = require('js-cookie');
const template = require('./template');
const { appendPhotos, addDivision } = require('./popup');

// GLOBALS
let isAppended = false;
// Check if admin is logged in
let auth = cookies.get('auth');
const formDrag = $('.home__exists');
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
  const savePositions = form => {
    const data = {};
    const info = []
  
    formDrag.children().each(function(index, element) {
      const id = parseInt($(this).find('.home__edit').eq(0).data('id'),10);
   
      const position = parseInt(
        $(this)
          .eq(0)
          .attr('data-position'),
        10
      );

      info.push([id, position]);

    });


    $.ajax({
      method: 'POST',
      url: `${window.location.origin}/api/casas/updatePositions`,
      data: {
        info
      },
    }).then(res=>{console.log(res)});
  };

  // Sortable drag & drop
  $(formDrag).sortable({
    update(event, ui) {
      $(this)
        .children()
        .each(function(index) {
          if ($(this).data('data-position') !== index) {
            $(this)
              .attr('data-position', index + 1)
              .addClass('updated');
          }
        });
      savePositions($('.home__form updated').children()[0]);
    }
  });

  // Uploads Multiple fotos
  $('.popup__fotos-form').on('change', '#fotos__divisao', function() {
    const hasDiv = $('#divisao')
      .find(':selected')
      .val();
    const nome = $('.popup__title--divisoes').text();
    const idCasa = $('.popup__form').data('id');
    const data = new FormData($('.popup__fotos-form')[0]);
    const data2 = new FormData();

    const tipo = $('#tipo')
      .val()
      .toString()
      .toLowerCase();
    const numero = $('#div__numero').val();
    const divisao = `${tipo}${numero}`;
    const preco = $('#preco').val();
    const disponivel = $('#disponivel').val();
    const quando = $('#quando').val();

    data2.append('divisao', hasDiv);
    data2.append('tipo', tipo);
    data2.append('numero', numero);
    data2.append('preco', preco);
    data2.append('disponivel', disponivel);
    data2.append('quando', quando);

    // eslint-disable-next-line no-restricted-syntax
    for (const pairs of data2.entries()) {
      data.append(pairs[0], pairs[1]);
    }
    data.append('nome', nome);
    data.append('idCasa', idCasa);
    if (hasDiv) {
      $.ajax({
        method: 'POST',
        url: `${window.location.origin}/api/casas/uploadMulti`,
        data,
        cache: false,
        contentType: false,
        processData: false
      }).then(res => {
        appendPhotos(null, res, nome, divisao);
      });
      return true;
    }
  });

  $('.popup__fotos-form').on('click', '.foto__form-label--add', function(e) {
    const hasDiv = $('#divisao')
      .find(':selected')
      .val();
    if (!hasDiv) {
      $(this)
        .next('input')
        .attr('type', '');
      alert('Fotos só podem ser adicionadas depois de criar a divisao');
    }
  });

  // Saves the division data
  $('#editSubmit').on('click', function(e) {
    const confirm = window.confirm(
      'Tens a certeza que queres guardar alterações?'
    );

    if (confirm) {
      const idCasa = $('.popup__form').data('id');
      const selector = $('#divisao').find(':selected');
      const mode = $('#divisao')
        .find(':selected')
        .data('mode');
      e.preventDefault();
      const photosForm = $('.popup__fotos-form');
      const idDivisao =
        mode !== 'create'
          ? $('#divisao')
              .find(':selected')
              .val()
          : null;

      const data = {
        idCasa,
        idDivisao,
        tipo: $('#tipo').val(),
        numero: $('#div__numero').val(),
        descricao: $('#descricao').val(),
        preco: $('#preco').val(),
        disponivel: $('#disponivel').prop('checked'),
        quando: $('#quando').val()
      };

      $.ajax({
        method: 'POST',
        url: `${window.location.origin}/api/casas/editDivisions`,
        dataType: 'json',
        data
      }).then(res => {
        if (res.action === 'created') {
          selector.val(`${res.created.idDivisao}`);
          selector.removeData('mode');
          selector.removeAttr('data-mode');
          selector.removeAttr('id');
          selector.text(`${data.tipo} ${data.numero}`);
          $('.foto__form-label--add')
            .next('input')
            .attr('type', 'file');
        } else if (res.action === 'updated') {
          selector.text(`${data.tipo} ${data.numero}`);
        }

        // Appends the option to create a new div
        addDivision();
      });
    }
  });

  // Adds calendar
  $('#quando').datepicker({
    dateFormat: 'yy/mm/dd'
  });

  // Removes autocomplete from popup from
  $('.popup__form').disableAutoFill({
    randomizeInputName: true
  });

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

  // Delete whole division
  $('#editDelete').on('click', function() {
    const confirm = window.confirm('Tens a certeza que queres apagar?');
    if (confirm) {
      const mode = $('#divisao')
        .find(':selected')
        .data('mode');
      const nome = $('.popup__title').text();
      const idDivisao =
        mode !== 'create'
          ? $('#divisao')
              .find(':selected')
              .val()
          : null;

      const data = {
        nome,
        idDivisao,
        tipo: $('#tipo').val(),
        numero: $('#div__numero').val(),
        descricao: $('#descricao').val(),
        preco: $('#preco').val(),
        disponivel: $('#disponivel').prop('checked'),
        quando: $('#quando').val()
      };

      if (mode !== 'create') {
        $.ajax({
          method: 'DELETE',
          url: `${window.location.origin}/api/casas/deleteDivision`,
          dataType: 'json',
          data
        }).then(res => {
          $('#divisao')
            .find(':selected')
            .remove();

          $('#divisao option:first').attr('selected', 'selected');
          $('#divisao').trigger('change');
        });
      }
    }
  });

  // Select division when changing select value
  $('.popup__form').on('change', '#divisao', function() {
    const idCasa = $(this)
      .parents('.popup__form')
      .data('id');

    const idDivisao = $(this)
      .find(':selected')
      .val();

    const mode = $(this)
      .find(':selected')
      .data('mode');

    const photosForm = $('.popup__fotos-form');

    if (mode !== 'create') {
      $.ajax({
        method: 'GET',
        url: `${window.location.origin}/api/casas?id=${idCasa}&div=${idDivisao}&edit`,
        dataType: 'json'
      }).then(casa => {
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
        appendPhotos(casa);
      });
      return true;
    }
    // Removes and appends the option to add thumbnails again
    photosForm.empty();
    photosForm.append(`
      <div class="fotos__foto fotos__foto--add">
        <label for="fotos__divisao" class="foto__form-label foto__form-label--add">
          <svg>
            <use xlink:href="#icon-upload"></use>
          </svg>
        </label>
        <input type="file" name="fotos" id="fotos__divisao" multiple required>
      </div>
    `);

    $(this)
      .parents('.popup__form')
      .find('input, textarea')
      .val('');

    $(this)
      .parents('.popup__form')
      .find('input[type=checkbox]')
      .prop('checked', false);

    return false;
  });

  // Deletes Home from Database
  $('.home__wrap').on('click', '.home__delete', function(e) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm('Tens a certeza que queres apagar?');

    if (confirm) {
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
    }
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

  // Deletes single division photo
  $('.popup__fotos-form').on('click', '.foto__delete', function() {
    const nome = $('.popup__title--divisoes').text();
    const idFoto = $(this).data('id');
    const idDivisao = $('#divisao')
      .find(':selected')
      .val();

    const tipo = $('#tipo')
      .val()
      .toString()
      .toLowerCase();
    const numero = $('#div__numero').val();
    const divisao = `${tipo}${numero}`;
    const filepath = $(this)
      .prev('img')
      .attr('src');

    $.ajax({
      method: 'DELETE',
      url: `${window.location.origin}/api/casas/removePhoto`,
      data: {
        idFoto,
        idDivisao,
        nome,
        divisao,
        filepath
      },
      dataType: 'json'
    }).then(res => {
      $(this)
        .closest('.fotos__foto')
        .remove();
    });
  });

  if (window.location.pathname === '/admin/dashboard') {
    if (auth !== '2') {
      window.location.replace('/admin/login');
    }
  }

  $('.admin__end').on('click', function() {
    auth = cookies.remove('auth');
    window.location.replace('/admin/login');
  });
});
