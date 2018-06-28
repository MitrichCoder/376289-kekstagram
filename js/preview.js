'use strict';

// ОВЕРЛЕЙ УВЕЛИЧЕННОГО ИЗОБРАЖЕНИЯ
(function () {
  // блоки фотографии в полноэкранном режиме и комментариев к ним
  var bigPictureBlock = document.querySelector('.big-picture');
  var commentsBlock = document.querySelector('.social__comments');

  var pictureImages = document.querySelectorAll('.picture__img'); // список фотогафий из блока .pictures
  var bigPictureCansel = document.querySelector('.big-picture__cancel');
  var commentTemplate = document.querySelector('#comment').content; // шаблоны комментариев к фотографии

  // формируем данные для оверлея (element - "номер" объекта массива photoArray)
  var getBigPictureData = function (element) {
    // url, количество лайков, количество комментариев, описание (случайное из списка)
    bigPictureBlock.querySelector('.big-picture__img').getElementsByTagName('img')[0].src = window.data.photosArray[element].url;
    bigPictureBlock.querySelector('.likes-count').textContent = window.data.photosArray[element].likes;
    bigPictureBlock.querySelector('.comments-count').textContent = window.data.photosArray[element].comments.length;
    bigPictureBlock.querySelector('.social__caption').textContent = window.app.getRandomElement(window.data.PHOTO_DISCRIPTION);

    // формирование DOM-элемента комментария
    var renderCommentElement = function (elem) {
      var elementBlock = commentTemplate.cloneNode(true);
      var url = 'img/avatar-' + window.app.randomInteger(1, 6) + '.svg';

      elementBlock.querySelector('.social__picture').src = url;
      elementBlock.querySelector('.social__text').textContent = elem;

      return elementBlock;
    };

    // формируем комментарии в блок .social__comment
    commentsBlock.innerHTML = ''; // ??? очищаем commentsBlock от ненужных комментариев

    // вставляем 2 первых из списка комментария к фотографии
    for (i = 0; i < 2; i += 1) {
      window.app.fragment.appendChild(renderCommentElement(window.data.photosArray[element].comments[i]));
    }

    // вставляем комментарии
    commentsBlock.appendChild(window.app.fragment);

    // ??? прячем блоки счётчика комментариев и загрузки новых комментариев
    document.querySelector('.social__comment-count').classList.add('visually-hidden');
    document.querySelector('.social__loadmore').classList.add('visually-hidden');
  };

  // ОТКРЫТИЕ/ЗАКРЫТИЕ ОВЕРЛЕЯ .big-picture с соответстующей фотографией
  var openBigPicture = function (elem) {
    // получаем порядковый номер фотографии, по которой произошёл клик и присваиваем его arrayNum
    for (var arrayNum = 0, max = pictureImages.length; arrayNum < max; arrayNum++) {
      if (elem === pictureImages[arrayNum].getAttribute('src')) {
        break;
      }
    }

    // формируем данные для оверлея
    getBigPictureData(arrayNum);

    // открываем оверлей
    bigPictureBlock.classList.remove('hidden');
  };

  var closeBigPicture = function () {
    bigPictureBlock.classList.add('hidden');
  };

  var pictureClickHendler = function (evt) {
    evt.preventDefault();

    var self = evt.target.getAttribute('src');

    openBigPicture(self);
  };

  var bigPictureCloseClickHendler = function (evt) {
    evt.preventDefault();
    closeBigPicture();
  };

  for (var i = 0; i < pictureImages.length; i++) {
    pictureImages[i].addEventListener('click', pictureClickHendler);
  }

  bigPictureCansel.addEventListener('click', bigPictureCloseClickHendler);
})();
