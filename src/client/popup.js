import onCreateDivisionCheckboxAvailable from './admin';
const exitPopup = $('.popup');
const modalsList = [
  {
    name: '#imovel'
  },
  {
    name: '#forms'
  },
  {
    name: '#info'
  },
  {
    name: '#faq'
  },
  {
    name: '#compare'
  },
  {
    name: '#divisoes'
  }
];
const updateInfo = (casa, counterDiv) => {
  $('.popup__tipo').html(
    `${casa.divisao[counterDiv].tipo} ${
      casa.divisao[counterDiv].numero ? casa.divisao[counterDiv].numero : ''
    }`
  );

  if(casa.divisao[counterDiv].preco && casa.divisao[counterDiv].disponivel === 1) {
    $('.popup__price').html(`${casa.divisao[counterDiv].preco}€`);
  } else if (casa.divisao[counterDiv].disponivel == 0 && casa.divisao[counterDiv].quando === null ) {
    $('.popup__price').html(`Nao Disponível`);  
  } else {
    $('.popup__price').html(`Disponível em ${casa.divisao[counterDiv].quando}`);
  }

/*   $('.popup__price').html(
    `${
      casa.divisao[counterDiv].preco ? `${casa.divisao[counterDiv].preco}€` : 'Nao Disponível'
    }`
  ); */

  $('.popup__comment').html(`${casa.divisao[counterDiv].descricao ? casa.divisao[counterDiv].descricao : ``}`);
};

const updatePhoto = (casa, counterDiv, counterPhotos) => {
  $('#leftPhoto').on('click', () => {
    console.log(`CounterDiv : ${counterDiv}, CounterPhotos: ${counterPhotos}`);
    if (counterDiv >= 0 && counterDiv <= casa.divisao.length) {
      if (
        counterPhotos > 0 &&
        counterPhotos <= casa.divisao[counterDiv].foto.length - 1
      ) {
        counterPhotos--;
        $('.popup__photos img').attr(
          'src',
          `/${casa.divisao[counterDiv].foto[counterPhotos].path}`
        );
      } else {
        counterDiv--;
        if (counterDiv >= 0) {
          counterPhotos = casa.divisao[counterDiv].foto.length - 1;
          $('.popup__photos img').attr(
            'src',
            `/${casa.divisao[counterDiv].foto[counterPhotos].path}`
          );
        } else {
          counterDiv = casa.divisao.length - 1;
          counterPhotos = casa.divisao[counterDiv].foto.length - 1;
          $('.popup__photos img').attr(
            'src',
            `/${casa.divisao[counterDiv].foto[counterPhotos].path}`
          );
        }
      }
    }
    updateInfo(casa, counterDiv, counterPhotos);
    window.window.history.replaceState(
      { popup: true },
      null,
      `/api/casas?id=${casa.idCasa}&div=${casa.divisao[counterDiv].idDivisao}&foto=${counterPhotos}`
    );
  });

  $('#rightPhoto').on('click', () => {
    if (counterDiv >= 0 && counterDiv < casa.divisao.length) {
      if (
        counterPhotos >= 0 &&
        counterPhotos < casa.divisao[counterDiv].foto.length - 1
      ) {
        counterPhotos++;
        $('.popup__photos img').attr(
          'src',
          `/${casa.divisao[counterDiv].foto[counterPhotos].path}`
        );
      } else {
        // IF the div has fotoss
        counterDiv++;
        if (counterDiv !== casa.divisao.length) {
          counterPhotos = 0;
          $('.popup__photos img').attr(
            'src',
            `/${casa.divisao[counterDiv].foto[counterPhotos].path}`
          );
        } else {
          counterDiv = 0;
          counterPhotos = 0;
          $('.popup__photos img').attr(
            'src',
            `/${casa.divisao[0].foto[counterPhotos].path}`
          );
        }
      }
    }
    console.log(`CounterDiv : ${counterDiv}, CounterPhotos: ${counterPhotos}`);
    updateInfo(casa, counterDiv, counterPhotos);
    // UPDATES URL on click left/right
    window.history.replaceState(
      { popup: true },
      null,
      `/api/casas?id=${casa.idCasa}&div=${casa.divisao[counterDiv].idDivisao}&foto=${counterPhotos}`
    );
  });
};

const appendPhotos = (casa = null, uploadFiles = null) => {
  if (casa || uploadFiles) {
    const photosForm = $('.popup__fotos-form');
    const fotos = casa && !uploadFiles ? casa.divisao[0].foto : uploadFiles;

    // Changes the layout of the thumbnails according to the number of fotos
    if (fotos.length >= 6) {
      photosForm.css('justify-content', 'flex-start');
    } else {
      photosForm.css('justify-content', 'center');
    }

    casa ? photosForm.empty() : null;

    // Appends the foto thumbnail to the division editor (NOTE) DONT APPEN IF SAME FOTO THERE
    if (fotos) {
      fotos.forEach((foto, index) => {
        if (!Array.isArray(foto)) {
          photosForm.append(`
            <div class="fotos__foto fotos__foto--show">
              <label class="foto__form-label">
                <img src="/${foto.path}" alt="foto-divisao">
                <button type="button" class="foto__delete" data-id="${foto.idFoto}">
                  <svg>
                    <use xlink:href="#delete"></use>
                  </svg>
                </button>
              </label>
            </div>
          `);
        }
      });
    }

    // Removes and appends the option to add thumbnails again
    $('.fotos__foto--add').remove();
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

    return true;
  }
};

const addDivision = () => {
  $('#divisao option[data-mode="create"]').remove();
  $('#divisao').append(`
  <option value="" data-mode="create" id="createDiv">
    &nbsp&nbsp->Add Division
  </option>
`);
};

const openModal = (modal, element) => {
  const modalExists = modalsList.find((value, key) => {
    return modalsList[key].name === modal;
  });

  if (modalExists) {
   

    $(modal).addClass('popup--visible');
    $('.popup__box').addClass('popup--open');
    $('body').css('overflow-y', 'hidden');

    if (modal === '#divisoes' && element) {

      // VARIABLES ////////////////////////////
      const photosForm = $('.popup__fotos-form');
      const idCasaString = $(element)
        .data('id')
        .toString();
        const idCasa = $(this)
        .parents('.popup__form')
        .data('id');
      const idDivisao = $(this)
        .find(':selected')
        .val();
      const mode = $(this)
        .find(':selected')
        .data('mode');
      ////////////////////////////////////////


        // Empties select values and fotos when opening
        $('#divisao').html('');
       
       // Select division when changing select value
      $('.popup__form').on('change, load', '#divisao', function() {
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
        onCreateDivisionCheckboxAvailable(casa);
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

      $('#disponivel').prop('checked', true); 
        return false;
      
      });

      $('.popup__form')
        .find('input, textarea')
        .val('');
      // ////////////////////////////

      $.ajax({
        method: 'GET',
        url: `${window.location.origin}/api/casas?id=${idCasaString}`,
        dataType: 'json'
      }).then(casa => {
        $('.popup__title').text(`${casa.nome}`);
        $('.popup__form').data('id', casa.idCasa);

        if (casa.divisao.length > 0) {
          // Populates select values
          casa.divisao.forEach(divisao => {
            $('#divisao').append(`
              <option value='${divisao.idDivisao}'>
              ${divisao.tipo} ${divisao.numero ? divisao.numero : ''}
              </option>
            `);
          });

          // Appends the option to create a new div
          addDivision();

          // Populate inputs with the values of the first division of the house
          $('#tipo').val(casa.divisao[0].tipo);
          $('#div__numero').val(casa.divisao[0].numero);
          $('#descricao').val(casa.divisao[0].descricao);
          $('#preco').val(casa.divisao[0].preco);

          onCreateDivisionCheckboxAvailable(casa);
          $('#quando').val(casa.divisao[0].quando);
          appendPhotos(casa);
          return true;
        }

        // Appends the option to create a new div
        addDivision();
        $('#disponivel').prop('checked', true);
        return false;
      });
    }
  }
};

const closeModal = () => {
  $('.popup__box')
    .removeClass('popup--open')
    .promise()
    .done(() => {
      $('.popup').removeClass('popup--visible');
      $('.popup__box').removeClass('popup--open');
      $('body').css('overflow-y', 'scroll');
    });
};

const getHomeWithView = (query, modal, counterDiv, counterPhotos, loaded) => {
  if (loaded) {
    // Check if Url contains query
    if (query.has('id') && query.has('div') && query.has('foto')) {
      const urlGet = `${window.location.origin}/api/casas?id=${query.get(
        'id'
      )}`;
      $.ajax({
        url: urlGet,
        method: 'GET'
      }).then(casa => {
        openModal(modal);
        window.history.replaceState({ popup: true }, null, null);
        updatePhoto(casa, counterDiv, counterPhotos);
      });
    }
    if (window.location.hash) {
      openModal(modal);
      window.history.replaceState({ popup: true }, null, null);
    }
    loaded = false;
  }
};

const getHomeWithQuery = (query, modal, counterDiv, counterPhotos) => {
  // Check if Url contains query
  if (query.has('id') && query.has('div') && query.has('foto')) {
    const urlGet = `${window.location.origin}/api/casas?id=${query.get(
      'id'
    )}&div=${query.get('div')}&json`;
    $.ajax({
      url: urlGet,
      method: 'GET'
    }).then(casa => {
      if (window.history.state != null) {
        if (window.history.state.popup) {
          // Finds the division in DB corresponding with the query div key
          const divisao = casa.divisao.find((value, key) => {
            return (
              casa.divisao[key].idDivisao === parseInt(query.get('div'), 10)
            );
          });

          const divNr = casa.divisao.findIndex((value, key) => {
            return (
              casa.divisao[key].idDivisao === parseInt(query.get('div'), 10)
            );
          });

          const fotoPath = divisao.foto[query.get('foto')].path;
          // //Loads Details
          $('.popup__mapa')
            .children('iframe')
            .remove();
          $('.popup__mapa').append(`
              <iframe frameborder="0" style="border:0" src="${casa.mapa}" allowfullscreen></iframe>
              `);
          $('.popup__photos img').attr('src', `/${fotoPath}`);

          updateInfo(casa, divNr);

          openModal(modal);
          window.history.replaceState({ popup: true }, null, null);
          updatePhoto(casa, counterDiv, counterPhotos);
        } else {
          closeModal();
        }
      }
    });
  }
};

$(document).ready(() => {
  // VARIABLES/////////////
  let query1 = window.location.search.slice(1);
  const { hash } = window.location;
  query1 = new URLSearchParams(query1);
  let numeroCasa;
  const counterDiv = 0;
  const counterPhotos = 0;
  let modal;
  modal = query1 && hash.length === 0 ? '#imovel' : hash;
  let loaded = true;
  const dashboard = window.location.pathname;

  // If url has a  query, fetch home from DB
  getHomeWithView(query1, modal, counterDiv, counterPhotos, loaded);

  // Fetch home from DB when clicking imovel 
  $('#imoveis').on('click', '.imovel', function() {
    // Variables
    const indexHome = $(this).data('id');
    const url = `/api/casas?id=${indexHome}`;

    $.ajax({
      url: window.location.origin + url,
      method: 'GET'
    }).then(casa => {
      
      const fotoPath = casa.divisao[0].foto[0].path.split(',')[0];

      // //Loads Details
      $('.popup__mapa')
        .children('iframe')
        .remove();
      $('.popup__mapa').append(`
      <iframe frameborder="0" style="border:0" src="${casa.mapa}" allowfullscreen></iframe>
      `);
      $('.popup__photos img').attr('src', `/${fotoPath}`);
      updateInfo(casa, counterDiv);
      updatePhoto(casa, counterDiv, counterPhotos);
      window.window.history.pushState(
        { popup: true },
        null,
        `${url}&div=${casa.divisao[0].idDivisao}&foto=${counterPhotos}`
      );
      openModal('#imovel');
    });
  });

  // Opens popup when certain elements are clicked
  $('body').on(
    'click',
    '#sidenav__faq, #form, .servicos__link, #btn__compare, .home__edit',
    function(e) {
      e.preventDefault();
      modal = `${$(this).data('modal')}`;
      // Checks if already opened a link before
      openModal(modal, this);
      
      if (!loaded && window.location.hash) {
        window.history.replaceState({ popup: true }, null, modal);
      } else {
        window.history.pushState({ popup: true }, null, modal);
        loaded = false;
      }
    }
  );

  // Listens for mouse clicks
  $(document).mousedown(e => {
    // Listens for mouse clicks outside the popup box in order to close it
    if (exitPopup.is(e.target) && exitPopup.has(e.target).length === 0) {
      if (window.history.state.popup) {
        if (!loaded || dashboard) {
          window.history.back();
        } else {
          window.history.pushState(
            { popup: false },
            null,
            window.location.origin
          );
          loaded = false;
        }
        closeModal();
      }
    }
  });

  // Closes Popup
  $('.close').on('click touchend', () => {
    if (window.history.state.popup) {
      if (!loaded) {
        window.history.back();
      } else {
        window.history.pushState(
          { popup: false },
          null,
          window.location.origin
        );
        loaded = false;
      }
      closeModal();
    }
  });

  // Display page properly when navigating browser window.history
  $(window).on('popstate', () => {
    if (window.history.state != null) {
      if (!window.history.state.popup) {
        closeModal();
        return;
      }

      if (window.location.hash && window.history.state.popup) {
        openModal(window.location.hash);
        return;
      }
      if (window.location.search && window.history.state.popup) {
        let query2 = window.location.search.slice(1);
        query2 = new URLSearchParams(query2);
        getHomeWithQuery(
          query2,
          '#imovel',
          query2.get('id'),
          query2.get('foto')
        );
        return;
      }
      console.log(window.history.state);
    }
    closeModal();
  });
});

module.exports = { exitPopup, appendPhotos, addDivision };
