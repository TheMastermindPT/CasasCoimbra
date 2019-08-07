
//GLOBALS
const width = $(window).width();
const clicked = 0;
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
    name: '#quartos'
  }
]
const updateInfo = (casa, counterDiv) => {
  $('.popup__tipo').html(
    `${casa.divisao[counterDiv].tipo} ${
    casa.divisao[counterDiv].numero ? casa.divisao[counterDiv].numero : ''
    }`,
  );

  $('.popup__price').html(
    `${casa.divisao[counterDiv].preco ? `${casa.divisao[counterDiv].preco}€` : ''}`,
  );

  $('.popup__comment').html(`${casa.divisao[counterDiv].descricao}`);
};

const updatePhoto = (casa, counterDiv, counterPhotos) => {
  $('#leftPhoto').on('click', () => {
    if (counterDiv >= 0 && counterDiv <= casa.divisao.length) {
      if (counterPhotos > 0 && counterPhotos <= casa.divisao[counterDiv].fotos[0].path.split(',').length - 1) {
        counterPhotos--;
        $('.popup__photos img').attr('src', '/' + casa.divisao[counterDiv].fotos[0].path.split(',')[counterPhotos]);
      } else {
        counterDiv--;
        if (counterDiv >= 0) {
          counterPhotos = casa.divisao[counterDiv].fotos[0].path.split(',').length - 1;
          $('.popup__photos img').attr('src', '/' + casa.divisao[counterDiv].fotos[0].path.split(',')[counterPhotos]);
        } else {
          counterDiv = casa.divisao.length - 1;
          counterPhotos = casa.divisao[counterDiv].fotos[0].path.split(',').length - 1;
          $('.popup__photos img').attr('src', '/' + casa.divisao[counterDiv].fotos[0].path.split(',')[counterPhotos]);
        }
      }
    }
    updateInfo(casa, counterDiv, counterPhotos);
    window.history.replaceState({ popup: true }, null, `/api/casas?id=${casa.numero}&div=${casa.divisao[counterDiv].idDivisao}&foto=${counterPhotos}`);
  });

  $('#rightPhoto').on('click', () => {
    if (counterDiv >= 0 && counterDiv < casa.divisao.length) {
      if (counterPhotos >= 0 && counterPhotos < casa.divisao[counterDiv].fotos[0].path.split(',').length - 1) {
        counterPhotos++;
        $('.popup__photos img').attr('src', '/' + casa.divisao[counterDiv].fotos[0].path.split(',')[counterPhotos]);
      } else {
        counterDiv++;
        if (counterDiv !== casa.divisao.length) {
          counterPhotos = 0;
          $('.popup__photos img').attr('src', '/' + casa.divisao[counterDiv].fotos[0].path.split(',')[counterPhotos]);
        } else {
          counterDiv = 0;
          counterPhotos = 0;
          $('.popup__photos img').attr('src', '/' + casa.divisao[0].fotos[0].path.split(',')[counterPhotos]);
        }
      }
    }
    updateInfo(casa, counterDiv, counterPhotos);
    window.history.replaceState({ popup: true }, null, `/api/casas?id=${casa.numero}&div=${casa.divisao[counterDiv].idDivisao}&foto=${counterPhotos}`);
  });
};

const openModal = (modal) => {
  const modalExists = modalsList.find((value, key) => {
    return modalsList[key].name === modal;
  });

  if (modalExists) {
    $(modal).addClass('popup--visible');
    $('.popup__box').addClass('popup--open');
    $('body').css('overflow-y', 'hidden');
  }
}

const closeModal = () => {
  $('.popup__box').removeClass('popup--open').promise().done(() => {
    $('.popup').removeClass('popup--visible');
    $('.popup__box').removeClass('popup--open');
    $('body').css('overflow-y', 'scroll');
  });
}

const getHomeWithView = (query, modal, counterDiv, counterPhotos, loaded) => {
  if (loaded) {
    //Check if Url contains query
    if (query.has('id') && query.has('div') && query.has('foto')) {
      const urlGet = `${window.location.origin}/api/casas?id=${query.get('id')}`;
      $.ajax({
        url: urlGet,
        method: 'GET',
      }).then(casa => {
        openModal(modal);
        history.replaceState({ popup: true }, null, null);
        updatePhoto(casa, counterDiv, counterPhotos);
      });
    }
    if (location.hash) {
      openModal(modal);
      history.replaceState({ popup: true }, null, null);
    }
    loaded = false;
  }
}

const getHomeWithQuery = (query, modal, counterDiv, counterPhotos) => {
  //Check if Url contains query
  if (query.has('id') && query.has('div') && query.has('foto')) {
    const urlGet = `${window.location.origin}/api/casas?id=${query.get('id')}&div=${query.get('div')}&json=true`;
    $.ajax({
      url: urlGet,
      method: 'GET',
    }).then(casa => {
      if (history.state != null) {
        if (history.state.popup) {
          //Finds the division in DB corresponding with the query div key
          const divisao = casa.divisao.find((value, key) => {
            return casa.divisao[key].idDivisao == parseInt(query.get('div'));
          });
          const fotoPath = divisao.fotos[0].path.split(',')[query.get('foto')];
          // //Loads Details
          $('.popup__mapa').children('iframe').remove();
          $('.popup__mapa').append(`
              <iframe frameborder="0" style="border:0" src="${casa.mapa}" allowfullscreen></iframe>
              `);
          $('.popup__photos img').attr('src', `/${fotoPath}`);
          openModal(modal);
          history.replaceState({ popup: true }, null, null);
          updatePhoto(casa, counterDiv, counterPhotos);
        } else {
          closeModal();
        }
      }
    });
  }
}

$(document).ready(() => {
  //VARIABLES/////////////
  let query1 = window.location.search.slice(1);
  const hash = window.location.hash;
  query1 = new URLSearchParams(query1);
  let numeroCasa;
  let counterDiv = 0;
  let counterPhotos = 0;
  let modal;
  modal = query1 && (hash.length === 0) ? '#imovel' : hash;
  let loaded = true;
  const dashboard = location.pathname;

  //If url has a  query, fetch home from DB
  getHomeWithView(query1, modal, counterDiv, counterPhotos, loaded);

  //Fetch home from DB when clicking imovel
  $('#imoveis').on('click', '.imovel', function (e) {
    // Variables
    const imovelDiv = $(this);
    numeroCasa = $('.imovel').index(imovelDiv) + 1;
    const url = `/api/casas?id=${numeroCasa}`;

    $.ajax({
      url: window.location.origin + url,
      method: 'GET',
    }).then(casa => {
      const fotoPath = casa.divisao[0].fotos[0].path.split(',')[0];

      // //Loads Details
      $('.popup__mapa').children('iframe').remove();
      $('.popup__mapa').append(`
      <iframe frameborder="0" style="border:0" src="${casa.mapa}" allowfullscreen></iframe>
      `);
      $('.popup__photos img').attr('src', `/${fotoPath}`);
      updateInfo(casa, counterDiv);
      updatePhoto(casa, counterDiv, counterPhotos);
      window.history.pushState({ popup: true }, null, `${url}&div=${casa.divisao[0].idDivisao}&foto=${counterPhotos}`);
      openModal('#imovel');
    });
  });

  //Opens popup when certain elements are clicked
  $('body').on('click', '#sidenav__faq, #form, .servicos__link, #btn__compare, .home__editar', function (e) {
    e.preventDefault();
    modal = `${$(this).data('modal')}`;
    //Checks if already opened a link before
    if (!loaded && location.hash) {
      history.replaceState({ popup: true }, null, modal);
    } else {
      history.pushState({ popup: true }, null, modal);
      loaded = false;
    }
    openModal(modal);

    if (modal === "#quartos") {
      console.log('rooms');
    }
  });

  //Listens for mouse clicks
  $(document).mouseup((e) => {
    //Listens for mouse clicks outside the popup box in order to close it
    if (exitPopup.is(e.target) && exitPopup.has(e.target).length === 0) {
      if (history.state.popup) {
        if (!loaded || dashboard) {
          history.back();
        } else {
          history.pushState({ popup: false }, null, window.location.origin);
          loaded = false;
        }
        closeModal();
      }
    }
  });

  //Closes Popup
  $('.close').on('click touchend', () => {
    if (history.state.popup) {
      if (!loaded) {
        history.back();
      } else {
        history.pushState({ popup: false }, null, window.location.origin);
        loaded = false;
      }
      closeModal();
    }
  });



  //Display page properly when navigating browser history
  $(window).on('popstate', e => {
    if (history.state != null) {
      if (!history.state.popup) {
        closeModal();
        return;
      }

      if (location.hash && history.state.popup) {
        openModal(location.hash);
        return;
      }
      if (location.search && history.state.popup) {
        let query2 = window.location.search.slice(1);
        query2 = new URLSearchParams(query2);
        getHomeWithQuery(query2, '#imovel', query2.get('id'), query2.get('foto'));
        return;
      }
    }
    closeModal();
    return;
  });
});

module.exports = { exitPopup };




