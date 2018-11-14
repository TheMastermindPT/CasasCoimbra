import { casas } from './casas';

const width = $(window).width();
const updateInfo = (box, counterDiv, counterPhotos) => {
  $('.popup__tipo').html(
    `${casas[box].divisoes[counterDiv].tipo} ${
      casas[box].divisoes[counterDiv].numero ? casas[box].divisoes[counterDiv].numero : ''
    }`,
  );

  $('.popup__price').html(
    `${casas[box].divisoes[counterDiv].preco ? `${casas[box].divisoes[counterDiv].preco}` : ''}`,
  );

  $('.popup__comment').html(`${casas[box].divisoes[counterDiv].descricao}`);
};

const clicked = 0;
$('.imoveis__box').on('click', function () {
  // if (width <= 1250) {
  //   if (!clicked) {
  //     clicked = 1;
  //   } else if (clicked) {
  //     clicked = 0;
  //   }
  // } else {
  // }

  $('.popup__box').css({
    width: '85%',
    height: '70%',
  });

  $('.popup').show();
  const box = $('.imoveis__box').index(this);
  $('.popup__info iframe').attr('src', casas[box].mapa);
  $('body').css('overflow', 'hidden');

  $('.popup__photos img').attr('src', casas[box].divisoes[0].fotos[0]);
  let counterDiv = 0;
  let counterPhotos = 0;

  $('.popup__details').html(`${casas[box].info}`);
  updateInfo(box, counterDiv, counterPhotos);

  $('#leftPhoto').on('click touchend', (e) => {
    if (counterDiv >= 0 && counterDiv <= casas[box].divisoes.length) {
      if (counterPhotos > 0 && counterPhotos <= casas[box].divisoes[counterDiv].fotos.length - 1) {
        counterPhotos--;
        $('.popup__photos img').attr('src', casas[box].divisoes[counterDiv].fotos[counterPhotos]);
      } else {
        counterDiv--;
        if (counterDiv >= 0) {
          counterPhotos = casas[box].divisoes[counterDiv].fotos.length - 1;
          $('.popup__photos img').attr('src', casas[box].divisoes[counterDiv].fotos[counterPhotos]);
        } else {
          counterDiv = casas[box].divisoes.length - 1;
          counterPhotos = casas[box].divisoes[counterDiv].fotos.length - 1;
          $('.popup__photos img').attr('src', casas[box].divisoes[counterDiv].fotos[counterPhotos]);
        }
      }
    }
    updateInfo(box, counterDiv, counterPhotos);
  });

  $('#rightPhoto').on('click touchend', (e) => {
    e.stopPropagation();
    if (counterDiv >= 0 && counterDiv < casas[box].divisoes.length) {
      if (counterPhotos >= 0 && counterPhotos < casas[box].divisoes[counterDiv].fotos.length - 1) {
        counterPhotos++;
        $('.popup__photos img').attr('src', casas[box].divisoes[counterDiv].fotos[counterPhotos]);
      } else {
        counterDiv++;
        if (counterDiv !== casas[box].divisoes.length) {
          counterPhotos = 0;
          $('.popup__photos img').attr('src', casas[box].divisoes[counterDiv].fotos[counterPhotos]);
        } else {
          counterDiv = 0;
          counterPhotos = 0;
          $('.popup__photos img').attr('src', casas[box].divisoes[0].fotos[0]);
        }
      }
    }
    updateInfo(box, counterDiv, counterPhotos);
  });
});
