require('./main');
const popup = require('./popup.js');
const template = require('./template');

const { exitPopup } = popup;



$(window).ready(() => {
  // VARIABLES ON LOAD /////////
  const imoveisWrapper = $('.imoveis__wrapper');
  const width = $(window).width();
  let clicked = $('.faq h3:first-child').get(0);
  let stateBox = false;
  let contactClick = 0;
  const sidenav = $('.sidenav');
  const svg = $('#imoveis').find('svg');
  const contacto = $('#numero');
  const foto = $('.popup__photos img');
  // ///////////////////////////



  $.ajax({
    url: `${window.location.origin}/api/casas`,
    method: 'GET'
  }).then(data => {
    // Calculate Number of ImoveisWrappers need to be in HTML
    const numberWrappers = number => {
      const result = Math.ceil(number / 3);
      return result;
    };

    // Add those wrappers to the HTML
    for (let i = 0; i < numberWrappers(data.length); i++) {
      $(`<div class="imoveis__wrapper"></div>`).insertBefore('#form');
    }

    // Loops each house and adds it to the correct Wrapper
    let times = 0;
    const houses3x = [];
    data.forEach((casa, index) => {
      if (index % 3 === 0 && index !== 0) {
        houses3x.push(index);
      }
    });

    data.forEach((casa, index) => {
      if (index % 3 === 0 && index !== 0) {
        times++;
      }
      if (index < 3) {
        template.templateHome(0, casa);
      } else if (index >= 3 && index < houses3x[houses3x.length - 1]) {
        const children = $('.imoveis__wrapper')
          .eq(times)
          .children().length;
        if (children < 3) {
          template(times, casa);
        }
      } else {
        template.templateHome(times, casa);
      }
      // Appends Button to House
      $('.imovel__info')
        .eq(index)
        .append(`<button class="conheca">Entrar</button>`);
    });

    // Appends X amount of placeholders depending on X of missing children
    $('.imoveis__wrapper').each(index => {
      const children = $('.imoveis__wrapper')
        .eq(index)
        .children().length;
      const numberOpenSlots = number => {
        const res = 3 - number;
        return res;
      };
      if (children < 3) {
        for (let i = 0; i < numberOpenSlots(children); i++) {
          $('.imoveis__wrapper')
            .eq(index)
            .append(`<div class="imovel--placeholder"></div> `);
        }
      }
    });
  });

  // Placeholder Imovel
  $.each(imoveisWrapper, index => {
    const imoveisNumber = imoveisWrapper.eq(index).children().length;

    if (imoveisNumber < 3) {
      $('.imoveis__wrapper').append(`<div class="imovel--placeholder"></div>`);
    }
  });

  // ANIMATES COUNTER
  $('.counter').counterUp({
    delay: 10,
    time: 1000
  });

  // STOP IMAGES FROM BEING DRAGGED
  $('img').on('dragstart', event => {
    event.preventDefault();
  });

  // HIDES SIDENAV LIST WHEN DOCUMENT OPEN
  $('.sidenav__list').css('display', 'none');

  // SCROLLS TO
  $('#casa').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#imoveis').offset().top
      },
      'slow'
    );
  });

  $('#proprietario').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#servicos').offset().top
      },
      'slow'
    );
  });

  $('#scrollToAbout').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#about').offset().top
      },
      'slow'
    );
  });

  $('#scrollToServicos').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#servicos').offset().top
      },
      'slow'
    );
  });

  $('#scrollToImoveis').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#imoveis').offset().top
      },
      'slow'
    );
  });

  $('#sidenav__quem').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#about').offset().top
      },
      'slow'
    );
  });

  $('#sidenav__servicos').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#servicos').offset().top
      },
      'slow'
    );
  });

  $('#sidenav__imoveis').on('click', () => {
    $('html,body').animate(
      {
        scrollTop: $('#imoveis').offset().top
      },
      'slow'
    );
  });

  // NAVIGATOR TOGGLE
  $('#navi-toggle').on('change', () => {
    const state = $('#navi-toggle').is(':checked');
    if (state) {
      $('#navigator').switchClass(
        'navigator--closed',
        'navigator',
        250,
        'linear'
      );

      setTimeout(() => {
        $('.sidenav__list').css('display', 'block');
      }, 400);
    } else {
      $('#navigator').switchClass(
        'navigator',
        'navigator--closed',
        250,
        'linear'
      );
      $('.sidenav__list').css('display', 'none');
    }
  });

  // ACCORDION FOR TERMS & CONDITIONS
  $('#accordion').accordion({
    active: 0,
    heightStyle: 'content'
  });

  // Terms and conditions title animation
  $('.faq h3').on('click', function() {
    if (clicked !== this) {
      $(this).animate(
        {
          width: '80%'
        },
        650
      );

      if (width <= 400) {
        $('.faq h3')
          .not(this)
          .animate(
            {
              width: '80%'
            },
            650
          );
      } else if (width > 400) {
        $('.faq h3')
          .not(this)
          .animate(
            {
              width: '60%'
            },
            650
          );
      }
    }

    clicked = this;
  });

  // Display mobile number on footer
  $('.footer__svgbg').on('click', () => {
    if (contactClick === 0) {
      $('.contacto').css('display', 'block');
      contactClick = 1;
    } else if (contactClick === 1) {
      $('.contacto').css('display', 'none');
      contactClick = 0;
    }
  });

  $(document).mouseup(e => {
    // Listens for mouse clicks outside the phone icon in footer in order to close it
    if (!contacto.is(e.target) && contacto.has(e.target).length === 0) {
      $('.contacto').css('display', 'none');
      contactClick = 0;
    }
    // Listens for mouse clicks outside the sidenav in order to close it
    // and toogles its animation
    if (
      !sidenav.is(e.target) &&
      sidenav.has(e.target).length === 0 &&
      !exitPopup.is(e.target) &&
      !svg.is(e.target)
    ) {
      $('#navigator').switchClass(
        'navigator',
        'navigator--closed',
        500,
        'linear'
      );
      $('.sidenav__list').css('display', 'none');
      $('.sidenav__checkbox').prop('checked', false);
    }
  });

  $('body').on('click', '#sidenav__faq, #form, #btn__compare, .imovel', () => {
    $('.popup__box').css({
      height: '80%',
      width: '85%'
    });
  });

  // RESPONSIVE PROCURA CASA // OPENS UP ON NEW TAB
  $('.btn--procura').on('click', e => {
    if (width <= 700) {
      e.preventDefault();
      window.open('https://goo.gl/forms/9vlsm07atToEu7ql1', '_blank');
    }
  });

  // CARDS FUNCTIONS
  $('.servicos__box').on('click', function() {
    const box = $('.servicos__box').index(this);
    $('.info__table').css('flex', '0 0 0');
    $('.info__table-list').css('display', 'none');

    // DEFINES RESPONSIVE POPUPBOX WIDTH
    if (width >= 1170) {
      $('.popup__box').css({ width: '40rem', height: '80%' });
    } else if (width < 1170) {
      $('.popup__box').css({ width: '40rem', height: '22rem' });
    }

    if (!stateBox) {
      if (width >= 1170) {
        $('.popup__box').css({
          width: '40rem'
        });
      }
      // RESPONSIVE CARD EXPANSION ANIMATION
      $('.info__list-item').on('click', function() {
        const $this = $('.info__list-item').index(this);
        if (width >= 1170) {
          $('.popup__box').animate(
            {
              width: '85%'
            },
            {
              step() {
                $('.popup__box').css('overflow', 'visible');
              }
            },
            600
          );
          $('.info__desc').css('flex', '0 0 40rem');
        } else if (width > 480 && width < 1170) {
          $('.popup__box').animate(
            {
              width: '85%'
            },
            {
              step() {
                $('.popup__box').css('overflow', 'visible');
              }
            },
            600
          );
          $('.info__desc').css('flex', '0 0 22rem');
        } else if (width <= 480) {
          $('.popup__box').animate(
            {
              height: '80%',
              width: '90%'
            },
            {
              step() {
                $('.popup__box').css('overflow', 'visible');
              }
            },
            600
          );
          $('.info__desc').css('flex', '0 0 22rem');
        }

        $('.info__table').animate(
          {
            flex: '1'
          },
          600,
          () => {
            $('.info__table-list')
              .eq($this)
              .css('display', 'flex');
            $(`.info__table-list:not(:eq(${$this}))`).css('display', 'none');
            $(`.info__table-list:not(:eq(${$this}))`).css('opacity', 0);
            $('.info__table-list')
              .eq($this)
              .animate(
                {
                  opacity: 1
                },
                500
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
                    opacity: 1
                  },
                  500
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
                    opacity: 1
                  },
                  500
                );
            }
          }
        );
      });
      stateBox = true;
    }

    // FILLS CARDS WITH THE PROPER INFORMATION
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
