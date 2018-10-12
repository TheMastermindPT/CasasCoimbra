import $ from 'jquery';
import './popup';

require('babel-runtime/regenerator');
require('webpack-hot-middleware/client?reload=true');
require('../scss/main.scss');
require('../index.html');

$(window).ready(() => {
  $('img').on('dragstart', (event) => {
    event.preventDefault();
  });

  $('.sidenav__list').css('display', 'none');

  $('#casa').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#imoveis').offset().top,
      },
      'slow',
    );
  });

  $('#proprietario').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#servicos').offset().top,
      },
      'slow',
    );
  });

  $('#scrollToAbout').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#about').offset().top,
      },
      'slow',
    );
  });

  $('#scrollToServicos').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#servicos').offset().top,
      },
      'slow',
    );
  });

  $('#scrollToImoveis').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#imoveis').offset().top,
      },
      'slow',
    );
  });

  $('#sidenav__quem').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#about').offset().top,
      },
      'slow',
    );
  });

  $('#sidenav__servicos').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#servicos').offset().top,
      },
      'slow',
    );
  });

  $('#sidenav__imoveis').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#imoveis').offset().top,
      },
      'slow',
    );
  });

  const width = $(window).width();
  const state = $('#navi-toggle').is(':checked');

  $('#navi-toggle').on('change', () => {
    const state = $('#navi-toggle').is(':checked');
    console.log(state);
    if (state) {
      $('#navigator').switchClass('navigator--closed', 'navigator', 500, 'linear');

      setTimeout(() => {
        $('.sidenav__list').css('display', 'block');
      }, 400);
    } else {
      $('#navigator').switchClass('navigator', 'navigator--closed', 500, 'linear');
      $('.sidenav__list').css('display', 'none');
    }
  });

  const third = $('.imoveis__box:first-child').position();
  const second = $('.imoveis__box:nth-child(2)').position();
  const first = $('.imoveis__box:nth-child(3)').position();
  const positions = [first, second, third];

  let slideCounter = 1;

  $('#changeLeft').on('click', () => {
    slideCounter--;

    if (slideCounter > -1 && slideCounter < 3) {
      $('.imoveis__wrap').animate(
        {
          left: positions[slideCounter].left,
        },
        650,
      );

      return false;
    }

    $('.imoveis__wrap').animate(
      {
        left: positions[2].left,
      },
      650,
    );
    slideCounter = 2;
  });

  $('#changeRight').on('click', () => {
    slideCounter++;

    if (slideCounter > -1 && slideCounter < 3) {
      $('.imoveis__wrap').animate(
        {
          left: positions[slideCounter].left,
        },
        650,
      );

      return false;
    }

    $('.imoveis__wrap').animate(
      {
        left: positions[0].left,
      },
      650,
    );
    slideCounter = 0;
  });

  $('#accordion').accordion({
    active: 0,
    heightStyle: 'content',
  });

  let clicked = $('.faq h3:first-child').get(0);

  $('.faq h3').on('click', function (e) {
    if (clicked !== this) {
      $(this).animate(
        {
          width: '80%',
        },
        650,
      );

      if (width <= 400) {
        $('.faq h3')
          .not(this)
          .animate(
            {
              width: '80%',
            },
            650,
          );
      } else if (width > 400) {
        $('.faq h3')
          .not(this)
          .animate(
            {
              width: '60%',
            },
            650,
          );
      }
    }

    clicked = this;
  });

  $('#numero').on('click', (e) => {
    $('.footer__mobile').css('display', 'block');
  });

  $(document).mouseup((e) => {
    const popup = $('.popup');
    const sidenav = $('.sidenav');
    const svg = $('#imoveis').find('svg');
    const contacto = $('#numero');

    if (popup.is(e.target) && popup.has(e.target).length === 0) {
      $('.popup').hide();
      window.history.back();
      $('#leftPhoto').off();
      $('#rightPhoto').off();
      $('body').css('overflow', 'scroll');
    }

    if (!contacto.is(e.target) && contacto.has(e.target).length === 0) {
      $('.footer__mobile').css('display', 'none');
    }

    if (
      !sidenav.is(e.target)
      && sidenav.has(e.target).length === 0
      && !popup.is(e.target)
      && !svg.is(e.target)
    ) {
      $('#navigator').switchClass('navigator', 'navigator--closed', 500, 'linear');
      $('.sidenav__list').css('display', 'none');
      $('.sidenav__checkbox').prop('checked', false);
    }
  });

  $('.close').on('click', () => {
    $('#leftPhoto').off();
    $('#rightPhoto').off();
    $('.popup').hide();
    $('body').css('overflow', 'scroll');
  });

  $('#sidenav__faq, #form, .servicos__box').on('click', () => {
    $('.popup').show();
    $('body').css('overflow', 'hidden');
  });

  $('.btn--procura').on('click', (e) => {
    if (width <= 700) {
      e.preventDefault();
      window.open('https://goo.gl/forms/9vlsm07atToEu7ql1', '_blank');
    }
  });

  $('.servicos__box').on('click', () => {
    $('.popup__box').css('width', '40rem');
    $('.info__table').css('flex', '0 0 0%');

    $('.info__list-item').on('click', () => {
      $('.info__table').animate(
        {
          flex: '1 0 auto',
        },
        800,
      );
      $('.popup__box').animate(
        {
          width: '85%',
        },
        800,
      );

      // $('.popup__box').css('width', '85%');

      // $('.info__table').css('flex', '1 0 auto');
    });
  });
});
