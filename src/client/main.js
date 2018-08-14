require('babel-runtime/regenerator');
require('webpack-hot-middleware/client?reload=true');
require('../scss/main.scss');
require('../index.html');

$('#scrollToAbout').on('click', () => {
  $('html,body').animate(
    {
      scrollTop: $('#about').offset().top,
    },
    'slow',
  );
  $('.sidenav__list span').css('background-color', '#d93240');
});

$('#scrollToServicos').on('click', () => {
  $('html,body').animate(
    {
      scrollTop: $('#servicos').offset().top,
    },
    'slow',
  );
  $('.sidenav__list span').css('background-color', '#2193b0');
});

$('#scrollToImoveis').on('click', () => {
  $('html,body').animate(
    {
      scrollTop: $('#imoveis').offset().top,
    },
    'slow',
  );
  $('.sidenav__list span').css('background-color', '#2193b0');
});

$('#sidenav__quem').on('click', () => {
  $('html,body').animate(
    {
      scrollTop: $('#about').offset().top,
    },
    'slow',
  );

  $('.sidenav__list span').css('background-color', '#d93240');
});

$('#sidenav__servicos').on('click', () => {
  $('html,body').animate(
    {
      scrollTop: $('#servicos').offset().top,
    },
    'slow',
  );

  $('.sidenav__list span').css('background-color', '#2193b0');
});

$('#sidenav__imoveis').on('click', () => {
  $('html,body').animate(
    {
      scrollTop: $('#imoveis').offset().top,
    },
    'slow',
  );

  $('.sidenav__list span').css('background-color', '#faf8f5');
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

$(document).ready(() => {
  $('.sidenav__list').css('display', 'none');
});
