'use strict';

// ОТРИСОВКА МИНИАТЮР
(function () {
  window.pictures = function () {
    // шаблоны пользовательских фотографий
    var pictureTemplate = document.querySelector('#picture').content;

    // пользовательские фотографии
    var pictureBlock = document.querySelector('.pictures');

    var renderPictureElement = function (element) {
      var elementBlock = pictureTemplate.cloneNode(true);

      elementBlock.querySelector('.picture__img').src = element.url;
      elementBlock.querySelector('.picture__stat--likes').textContent = element.likes;
      elementBlock.querySelector('.picture__stat--comments').textContent = element.comments.length;

      return elementBlock;
    };

    // 3. ОТРИСОВКА СОЗДАННЫХ DOM-ЭЛЕМЕНТОВ В БЛОК .pictures *******************************************************************
    for (var i = 0; i < window.data.photosArray.length; i++) {
      window.app.fragment.appendChild(renderPictureElement(window.data.photosArray[i]));
    }

    pictureBlock.appendChild(window.app.fragment);
  };
})();
