'use strict';

(function () {
  var pictureBlock = document.querySelector('.pictures');
  var pictureTitle = document.querySelector('.pictures__title');
  var imgUpload = document.querySelector('.img-upload');

  var buttonPopular = document.querySelector('#filter-popular');
  var buttonNew = document.querySelector('#filter-new');
  var buttonDiscussed = document.querySelector('#filter-discussed');
  var filterButtons = document.querySelectorAll('.img-filters__button');

  // стили для кнопок
  var setButtonStyle = function () {
    for (var i = 0; i < filterButtons.length; i++) {
      filterButtons[i].classList.remove('img-filters__button--active');
    }

    document.activeElement.classList.add('img-filters__button--active');
  };

  // перерисовка блока с фотографиями
  var reRenderPicture = function (reRenderArray) {
    pictureBlock.innerHTML = '';
    pictureBlock.appendChild(pictureTitle);
    pictureBlock.appendChild(imgUpload);

    window.pictures(reRenderArray);
    window.preview();
    setButtonStyle();
  };

  // фотографии в изначальном порядке
  var popularClickHandler = window.debounce(function () {

    var popular = window.data.photosArray;
    reRenderPicture(popular);
  });

  // 10 случайных, не повторяющихся фотографий
  var newClickHandler = window.debounce(function () {

    var news = [];

    var newsItems = window.app.getRandomArray(10, 0, window.data.photosArray.length - 1);

    for (var i = 0; i < newsItems.length; i++) {
      news.push(window.data.photosArray[newsItems[i]]);
    }

    reRenderPicture(news);
  });

  // сортировка по самым обсуждаемым фотографиям (в порядке их убывания)
  var discussedClickHandler = window.debounce(function () {

    var discussions = window.data.photosArray.slice().sort(function (less, more) {
      return more.comments.length - less.comments.length;
    });

    reRenderPicture(discussions);
  });

  buttonPopular.addEventListener('click', popularClickHandler);
  buttonNew.addEventListener('click', newClickHandler);
  buttonDiscussed.addEventListener('click', discussedClickHandler);
})();
