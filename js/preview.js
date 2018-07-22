'use strict';

// ОВЕРЛЕЙ УВЕЛИЧЕННОГО ИЗОБРАЖЕНИЯ
(function () {

  window.preview = function () {
    var ESC_KEYCODE = 27;
    var ENTER_KEYCODE = 13;
    var currentComments;


    // блоки фотографии в полноэкранном режиме и комментариев к ним
    var bigPictureBlock = document.querySelector('.big-picture');
    var commentsBlock = document.querySelector('.social__comments');

    var imageLinks = document.querySelectorAll('.picture__link');
    var pictureImages = document.querySelectorAll('.picture__img'); // список фотогафий из блока .pictures
    var bigPictureClose = document.querySelector('.big-picture__cancel');
    var commentTemplate = document.querySelector('#comment').content; // шаблоны комментариев к фотографии

    // формируем данные для оверлея (number - "номер" объекта массива photos)
    var getBigPictureData = function (number) {
      var numberOfComments = window.data.photos[number].comments.length;

      bigPictureBlock.querySelector('.social__comment-count').innerHTML = '<span class="comments-curent"></span> из <span class="comments-count"></span> комментариев';

      // url, количество лайков, количество комментариев, описание (случайное из списка)
      bigPictureBlock.querySelector('.big-picture__img').getElementsByTagName('img')[0].src = window.data.photos[number].url;
      bigPictureBlock.querySelector('.likes-count').textContent = window.data.photos[number].likes;
      bigPictureBlock.querySelector('.comments-count').textContent = numberOfComments;
      bigPictureBlock.querySelector('.social__caption').textContent = window.app.getRandomElement(window.data.PHOTO_DISCRIPTION);

      // формирование DOM-элемента комментария
      var renderCommentElement = function (numbers) {
        var elementBlock = commentTemplate.cloneNode(true);
        var url = 'img/avatar-' + window.app.randomInteger(1, 6) + '.svg';

        elementBlock.querySelector('.social__picture').src = url;
        elementBlock.querySelector('.social__text').textContent = numbers;

        return elementBlock;
      };

      // формируем комментарии в блок .social__comment
      commentsBlock.innerHTML = ''; // ??? очищаем commentsBlock от ненужных комментариев

      // вставляем комментарии к фотографии
      if (numberOfComments < 5) {
        currentComments = numberOfComments;

        bigPictureBlock.querySelector('.comments-curent').textContent = currentComments;

        for (i = 0; i < numberOfComments; i += 1) {
          window.app.fragment.appendChild(renderCommentElement(window.data.photos[number].comments[i]));
        }
      } else {
        currentComments = 5;
        bigPictureBlock.querySelector('.comments-curent').textContent = currentComments;

        for (i = 0; i < 5; i += 1) {
          window.app.fragment.appendChild(renderCommentElement(window.data.photos[number].comments[i]));
        }
      }

      // вставляем комментарии
      commentsBlock.appendChild(window.app.fragment);

      // ??? прячем блоки счётчика комментариев и загрузки новых комментариев
      // document.querySelector('.social__comment-count').classList.add('visually-hidden');
      // document.querySelector('.social__loadmore').classList.add('visually-hidden');
    };

    // ОТКРЫТИЕ/ЗАКРЫТИЕ ОВЕРЛЕЯ .big-picture с соответстующей фотографией
    var openBigPicture = function (element) {
      // получаем порядковый номер фотографии, по которой произошёл клик и присваиваем его arrayNumbers
      for (var arrayNumbers = 0; arrayNumbers < window.data.photos.length; arrayNumbers++) {
        if (element === window.data.photos[arrayNumbers].url) {
          break;
        }
      }

      // формируем данные для оверлея
      getBigPictureData(arrayNumbers);

      // открываем оверлей
      bigPictureBlock.classList.remove('hidden');
      document.body.classList.add('modal-open');

      bigPictureClose.addEventListener('click', bigPictureCloseClickHandler);
      document.addEventListener('keydown', closeBigPicture);
    };

    var pictureClickHandler = function (evt) {
      evt.preventDefault();

      var self = evt.target.getAttribute('src');
      openBigPicture(self);
    };

    var openPreview = function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        evt.preventDefault();
        var self = evt.target.getElementsByTagName('img')[0].getAttribute('src');
        openBigPicture(self);
      }
    };

    var bigPictureCloseClickHandler = function () {
      bigPictureBlock.classList.add('hidden');
      document.body.classList.remove('modal-open');

      bigPictureClose.removeEventListener('click', bigPictureCloseClickHandler);
      document.removeEventListener('keydown', closeBigPicture);
    };

    var closeBigPicture = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        bigPictureCloseClickHandler();
      }
    };

    for (var i = 0; i < pictureImages.length; i++) {
      pictureImages[i].addEventListener('click', pictureClickHandler);
    }

    for (i = 0; i < pictureImages.length; i++) {
      imageLinks[i].addEventListener('keydown', openPreview);
    }
  };
})();
