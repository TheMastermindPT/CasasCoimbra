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

  let contactClick = 0;

  $('.footer__svgbg').on('click', (e) => {
    if (contactClick === 0) {
      $('.contacto').css('display', 'block');
      contactClick = 1;
    } else if (contactClick === 1) {
      $('.contacto').css('display', 'none');
      contactClick = 0;
    }
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
      $('.contacto').css('display', 'none');
      contactClick = 0;
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

  $('#sidenav__faq, #form, .servicos__link, #btn__compare').on('click', () => {
    $('body').css('overflow', 'hidden');
    $('.popup').show();
  });

  $('.btn--procura').on('click', (e) => {
    if (width <= 700) {
      e.preventDefault();
      window.open('https://goo.gl/forms/9vlsm07atToEu7ql1', '_blank');
    }
  });

  let stateBox = false;

  $('.servicos__box').on('click', function () {
    $('.info__table').css('flex', '0 0 0');
    $('.info__table-list').css('display', 'none');

    if (width >= 1170) {
      $('.popup__box').css({
        width: '40rem',
        height: '80%',
      });
    } else if (width < 1170) {
      $('.popup__box').css({
        width: '40rem',
        height: '22rem',
      });
    }

    const box = $('.servicos__box').index(this);

    if (!stateBox) {
      if (width >= 1170) {
        $('.popup__box').css({
          width: '40rem',
        });
      }

      $('.info__list-item').on('click', function () {
        const $this = $('.info__list-item').index(this);

        if (width >= 1170) {
          $('.popup__box').animate(
            {
              width: '85%',
            },
            {
              step() {
                $('.popup__box').css('overflow', 'visible');
              },
            },
            600,
          );
          $('.info__desc').css('flex', '0 0 40rem');
        } else if (width > 480 && width < 1170) {
          $('.popup__box').animate(
            {
              width: '85%',
            },
            {
              step() {
                $('.popup__box').css('overflow', 'visible');
              },
            },
            600,
          );
          $('.info__desc').css('flex', '0 0 22rem');
        } else if (width <= 480) {
          $('.popup__box').animate(
            {
              height: '80%',
            },
            {
              step() {
                $('.popup__box').css('overflow', 'visible');
              },
            },
            600,
          );
          $('.info__desc').css('flex', '0 0 22rem');
        }

        $('.info__table').animate(
          {
            flex: '1',
          },
          600,
          () => {
            $('.info__table-list')
              .eq($this)
              .css('display', 'block');
            $(`.info__table-list:not(:eq(${$this}))`).css('display', 'none');
            $(`.info__table-list:not(:eq(${$this}))`).css('opacity', 0);
            $('.info__table-list')
              .eq($this)
              .animate(
                {
                  opacity: 1,
                },
                500,
              );
            if ($this === 5) {
              $('.info__tabela')
                .eq(0)
                .css('display', 'block');

              $('.info__tabela')
                .eq(1)
                .css('display', 'none');

              $('.info__tabela')
                .eq(0)
                .animate(
                  {
                    opacity: 1,
                  },
                  500,
                );

              $('.info__tabela')
                .eq(1)
                .css('opacity', 0);
            } else if ($this === 6) {
              $('.info__tabela')
                .eq(1)
                .css('display', 'block');
              $('.info__tabela')
                .eq(0)
                .css('display', 'none');
              $('.info__tabela')
                .eq(0)
                .css('opacity', 0);

              $('.info__tabela')
                .eq(1)
                .animate(
                  {
                    opacity: 1,
                  },
                  500,
                );
            }
          },
        );
      });
      stateBox = true;
    }
  });

  $('.servicos__box').on('click', function () {
    const box = $('.servicos__box').index(this);
    $('.info__tabela').css('display', 'none');
    if (box === 0) {
      $('.info__main:first-child').css('display', 'flex');
      $('.info__main:not(:first-child)').css('display', 'none');
    } else if (box === 1) {
      $('.info__main:nth-child(2)').css('display', 'flex');
      $('.info__main:not(:nth-child(2))').css('display', 'none');
    } else if (box === 2) {
      $('.info__main:nth-child(3)').css('display', 'flex');
      $('.info__main:not(:nth-child(3))').css('display', 'none');
    }
  });
});
