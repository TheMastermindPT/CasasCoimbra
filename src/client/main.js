import $ from 'jquery';
import './popup';

require('babel-runtime/regenerator');
require('webpack-hot-middleware/client?reload=true');
require('../scss/main.scss');
require('../index.html');

$(window).ready(() => {
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

  $('#navi-toggle').on('change', () => {
    const state = $('#navi-toggle').is(':checked');
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

      $('.faq h3')
        .not(this)
        .animate(
          {
            width: '30%',
          },
          650,
        );
    }

    clicked = this;
  });

  $(document).mouseup((e) => {
    const popup = $('.popup');
    const sidenav = $('.sidenav');

    if (popup.is(e.target) && popup.has(e.target).length === 0) {
      $('.popup').hide();
      window.history.back();
      // window.location.replace('/index.html');
      $('#leftPhoto').off();
      $('#rightPhoto').off();
      $('body').css('overflow', 'scroll');
    }

    if (!sidenav.is(e.target) && sidenav.has(e.target).length === 0 && !popup.is(e.target)) {
      $('#navi-toggle').prop('checked', false);
      $('#navigator').switchClass('navigator', 'navigator--closed', 500, 'linear');
      $('.sidenav__list').css('display', 'none');
    }
  });

  $('.close').on('click', () => {
    $('#leftPhoto').off();
    $('#rightPhoto').off();
    $('.popup').hide();
    $('body').css('overflow', 'scroll');
  });

  $('#sidenav__faq, #form').on('click', () => {
    $('.popup').show();
    $('body').css('overflow', 'hidden');
  });
});
