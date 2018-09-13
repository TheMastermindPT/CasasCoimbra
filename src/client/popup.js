import { casas } from './casas';

$('.imoveis__box').on('click', function () {
  $('.popup').show();
  const box = $('.imoveis__box').index(this);
  $('.popup__info iframe').attr('src', casas[box].mapa);

  $('.popup__photos img').attr('src', casas[box].divisoes[0].fotos[0]);
  let counterDiv = 0;
  let counterPhotos = 0;
  $('.popup__tipo').html(
    `${casas[box].divisoes[counterDiv].tipo} ${casas[box].divisoes[counterDiv].numero}`,
  );

  $('#leftPhoto').on('click', (e) => {
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

      $('.popup__tipo').html(
        `${casas[box].divisoes[counterDiv].tipo} ${
          casas[box].divisoes[counterDiv].numero ? casas[box].divisoes[counterDiv].numero : ''
        }`,
      );
    }
  });

  $('#rightPhoto').on('click', (e) => {
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

    $('.popup__tipo').html(
      `${casas[box].divisoes[counterDiv].tipo} ${
        casas[box].divisoes[counterDiv].numero ? casas[box].divisoes[counterDiv].numero : ''
      }`,
    );
  });
});
