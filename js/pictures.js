'use strict';

// данные для массива фотографий
var PHOTOS = []; // массив объектов, описывающих фотографии
var photosQuantity = 25; // общее количество фотографий
var minLikes = 15; // минимальное количество лайков
var maxLikes = 200; // максимальное количество лайков
var commentSentences = 2; // максимальное количество предложений в одном комментарии
var comentsQuantity = 10; // количество комментариев к фотографии
var userComments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var photoDiscription = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья.\nНе обижайте всех словами......', 'Вот это тачка!'];

// формирование массива целых чисел в заданном диапазоне (от...до, включительно)
var createArray = function (min, max) {
  var arr = [];

  for (var i = min; i < max + 1; i += 1) {
    arr.push(i);
  }

  return arr;
};

// случайное число в заданном диапазоне (от...до, включительно)
var randomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};

// получение случайного элемента массива
var getRandomElement = function (arr) {
  var arrElement = Math.floor(Math.random() * arr.length);
  return arr[arrElement];
};

// случайное true или false
var trueOrFalse = function () {
  return (Math.floor(Math.random() * 2) === 0);
};

// ГЕНЕРАЦИЯ МАССИВА ОБЪЕКТОВ, ОПИСЫВАЮЩИХ ФОТОГРАФИИ
// массив номеров фотографий в случайном порядке (для url фотографий)
var photosNumber = createArray(1, photosQuantity).sort(function () {
  return Math.random() - 0.5;
});

// создание комментария к фотографии (из одного или нескольких предложений рандомно)
var createComment = function () {
  var comment = '';

  if (trueOrFalse() === true) {
    // формируем одно предложение комментария
    comment = getRandomElement(userComments);
  } else {
    // формируем два или более предложений комментария
    var max = randomInteger(2, commentSentences);

    for (var i = 0; i < max - 1; i += 1) {
      comment = comment + getRandomElement(userComments) + ' ';
    }

    // крайнее предложение комментария
    comment = comment + getRandomElement(userComments);
  }

  return comment;
};

// создание массива комментариев к фотографии (количество комментариев от 5 до 10)
var createComments = function () {
  var comments = [];
  var max = randomInteger(5, comentsQuantity);

  for (var i = 0; i < max; i += 1) {
    comments.push(createComment());
  }

  return comments;
};

// генерация массива объектов, описывающих фотографии
for (var i = 0; i < photosQuantity; i++) {
  var newPhoto = {
    url: 'photos/' + photosNumber[i] + '.jpg',
    likes: randomInteger(minLikes, maxLikes),
    comments: createComments(),
    description: getRandomElement(photoDiscription)
  };

  PHOTOS.push(newPhoto);
}

// работа с DOM
var pictureTemplate = document.querySelector('#picture').content;
var commentTemplate = document.querySelector('#comment').content;
var pictureBlock = document.querySelector('.pictures');
var commentsBlock = document.querySelector('.social__comments');

var fragment = document.createDocumentFragment();

// отображение элемента .big-picture и заполнение его данными
var bigPictureBlock = document.querySelector('.big-picture');
bigPictureBlock.classList.remove('hidden');

bigPictureBlock.querySelector('.big-picture__img').getElementsByTagName('img')[0].src = PHOTOS[0].url;
bigPictureBlock.querySelector('.likes-count').textContent = PHOTOS[0].likes;
bigPictureBlock.querySelector('.comments-count').textContent = PHOTOS[0].comments.length;
bigPictureBlock.querySelector('.social__caption').textContent = getRandomElement(photoDiscription);

// формирование DOM-элемента соответствующей фотографии и наполенение его данными
var renderPictureElement = function (element) {
  var elementBlock = pictureTemplate.cloneNode(true);

  elementBlock.querySelector('.picture__img').src = element.url;
  elementBlock.querySelector('.picture__stat--likes').textContent = element.likes;
  elementBlock.querySelector('.picture__stat--comments').textContent = element.comments.length;

  return elementBlock;
};

// DOM-элементы в блок .pictures
for (i = 0; i < PHOTOS.length; i += 1) {
  fragment.appendChild(renderPictureElement(PHOTOS[i]));
}

pictureBlock.appendChild(fragment);

// формирование DOM-элемента комментария
var renderCommentElement = function (element) {
  var elementBlock = commentTemplate.cloneNode(true);
  var url = 'img/avatar-' + randomInteger(1, 6) + '.svg';

  elementBlock.querySelector('.social__picture').src = url;
  elementBlock.querySelector('.social__text').textContent = element;

  return elementBlock;
};

// DOM-элементы в блок .social__comment (чистим содержимое и вставляем 2 первых комментария к фотографии)
commentsBlock.innerHTML = '';

for (i = 0; i < 2; i += 1) { // оставил всё таки 2 комента, т.к. ниже блок "5 из ... комментариев вообще прячется..."
  fragment.appendChild(renderCommentElement(PHOTOS[0].comments[i]));
}

commentsBlock.appendChild(fragment);

// прячем блоки счётчика комментариев и загрузки новых комментариев
// не нашёл в разметке блока с классом .social__comment-loadmore, есть только .social__loadmore (наверное, ошибка в ТЗ)
document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.social__loadmore').classList.add('visually-hidden');
