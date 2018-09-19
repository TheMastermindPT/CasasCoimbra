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

  $('#accordion').accordion({
    active: 0,
    heightStyle: 'content',
    collapsible: true,
  });

  $('.servicos__accordion').accordion({
    active: 0,
    heightStyle: 'content',
  });

  $('#sidenav__faq').on('click', () => {
    $('html').bind('mousewheel', () => false);
  });

  $(document).mouseup((e) => {
    const popup = $('.popup');
    const sidenav = $('.sidenav');

    if (popup.is(e.target) && popup.has(e.target).length === 0) {
      window.history.back();
      $('.popup').hide();
      $('#leftPhoto').off();
      $('#rightPhoto').off();
      $('html').unbind('mousewheel');
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
    $('html').unbind('mousewheel');
  });

  $('#sidenav__faq').on('click', () => {
    $('.popup').show();
  });
});
