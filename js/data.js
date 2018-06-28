'use strict';

// ГЕНЕРАЦИЯ МАССИВА ОБЪЕКТОВ, ОПИСЫВАЮЩИХ ФОТОГРАФИИ
(function () {
  window.data = {
    photosArray: [],
    PHOTO_DISCRIPTION: ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья.\nНе обижайте всех словами......', 'Вот это тачка!']
  };

  var PHOTOS_QUANTITY = 25; // общее количество фотографий
  var MIN_LIKES = 15; // минимальное количество лайков
  var MAX_LIKES = 200; // максимальное количество лайков
  var COMMENT_SENTENCES = 2; // максимальное количество предложений в одном комментарии
  var COMMENTS_QUANTITY = 10; // количество комментариев к фотографии
  var USER_COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

  // массив номеров фотографий в случайном порядке (для url фотографий)
  var photosNumber = window.app.createArray(1, PHOTOS_QUANTITY).sort(function () {
    return Math.random() - 0.5;
  });

  // создание комментария к фотографии (из одного или нескольких предложений рандомно)
  var createComment = function () {
    var comment = '';

    if (window.app.trueOrFalse()) {
      // формируем одно предложение комментария
      comment = window.app.getRandomElement(USER_COMMENTS);
    } else {
      // формируем два или более предложений комментария
      var max = window.app.randomInteger(2, COMMENT_SENTENCES) - 1;

      for (var i = 0; i < max; i++) {
        comment = comment + window.app.getRandomElement(USER_COMMENTS) + ' ';
      }

      // крайнее предложение комментария
      comment = comment + window.app.getRandomElement(USER_COMMENTS);
    }

    return comment;
  };

  // создание массива комментариев к фотографии (количество комментариев от 5 до 10)
  var createComments = function () {
    var comments = [];
    var max = window.app.randomInteger(5, COMMENTS_QUANTITY);

    for (var i = 0; i < max; i += 1) {
      comments.push(createComment());
    }

    return comments;
  };

  // генерация массива объектов, описывающих фотографии
  for (var i = 0; i < PHOTOS_QUANTITY; i++) {
    var newPhoto = {
      url: 'photos/' + photosNumber[i] + '.jpg',
      likes: window.app.randomInteger(MIN_LIKES, MAX_LIKES),
      comments: createComments(),
      description: window.app.getRandomElement(window.data.PHOTO_DISCRIPTION)
    };

    window.data.photosArray.push(newPhoto);
  }
})();
