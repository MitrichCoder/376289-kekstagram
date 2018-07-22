'use strict';

// ОТРИСОВКА МИНИАТЮР
(function () {
  window.renderPictures = function (miniatures) {
    // шаблоны пользовательских фотографий
    var pictureTemplate = document.querySelector('#picture').content;
    var imageFilters = document.querySelector('.img-filters');

    // пользовательские фотографии
    var pictureBlock = document.querySelector('.pictures');

    var renderPictureElement = function (element) {
      var elementBlock = pictureTemplate.cloneNode(true);

      elementBlock.querySelector('.picture__img').src = element.url;
      elementBlock.querySelector('.picture__stat--likes').textContent = element.likes;
      elementBlock.querySelector('.picture__stat--comments').textContent = element.comments.length;

      return elementBlock;
    };

    // отрисовка созданных DOM-элементов в блок .pictures
    for (var i = 0; i < miniatures.length; i++) {
      window.app.fragment.appendChild(renderPictureElement(miniatures[i]));
    }

    pictureBlock.appendChild(window.app.fragment);
    imageFilters.classList.remove('img-filters--inactive');
  };
})();
