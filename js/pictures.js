'use strict';

// данные для массива фотографий
var photosArray = []; // массив объектов, описывающих фотографии

var PHOTOS_QUANTITY = 25; // общее количество фотографий
var MIN_LIKES = 15; // минимальное количество лайков
var MAX_LIKES = 200; // максимальное количество лайков
var COMMENT_SENTENCES = 2; // максимальное количество предложений в одном комментарии
var COMMENTS_QUANTITY = 10; // количество комментариев к фотографии
var USER_COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var PHOTO_DISCRIPTION = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья.\nНе обижайте всех словами......', 'Вот это тачка!'];

var ESC_KEYCODE = 27;

var SCALE_WIDTH = 453; // общая ширина scale у пина
var SCALE_START = 100; // начальное значение положения пина и прогресс-линии в %

var RESIZE_MAX = 100; // максимальное значение масштаба превью фотографии
var RESIZE_MIN = 25; // минимальное значение масштаба превью фотографии
var RESIZE_STEP = 25; // шаг изменения масштаба превью фотографии

// DOM-ELEMENTS
// шаблоны пользовательских фотографий и комментариев к фотографии в полноэкранном режиме
var pictureTemplate = document.querySelector('#picture').content;
var commentTemplate = document.querySelector('#comment').content;

// пользовательские фотографии
var pictureBlock = document.querySelector('.pictures');

// блоки фотографии в полноэкранном режиме и комментариев к ним
var bigPictureBlock = document.querySelector('.big-picture');
var commentsBlock = document.querySelector('.social__comments');

// редактор фотографии
var uploadFile = document.querySelector('#upload-file');
var imageEditor = document.querySelector('.img-upload__overlay');
var editorCloseBtn = document.querySelector('#upload-cancel');

var imgPreview = document.querySelector('.img-upload__preview').getElementsByTagName('img')[0];
var effectButtons = document.querySelectorAll('.effects__radio');

// кнопки масштаба фотографии
var resizeMinus = document.querySelector('.resize__control--minus');
var resizePlus = document.querySelector('.resize__control--plus');
var resizeField = document.querySelector('.resize__control--value');

// пин уровня эффекта
var scale = document.querySelector('.scale');
var scalePin = document.querySelector('.scale__pin');
var scaleLevel = document.querySelector('.scale__level');
var scaleValue = document.querySelector('.scale__value');

// ОБЩИЕ ФУНКЦИИ **********************************************************************************************************
// формирование массива целых чисел в заданном диапазоне (от...до, включительно)
var createArray = function (min, max) {
  var arr = [];

  for (var i = min; i <= max; i++) {
    arr.push(i);
  }

  return arr;
};

// случайное число в заданном диапазоне (от...до, включительно)
var randomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// получение случайного элемента массива
var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// случайное true или false
var trueOrFalse = function () {
  return Math.random() < 0.5;
};

// 1. ГЕНЕРАЦИЯ МАССИВА ОБЪЕКТОВ, ОПИСЫВАЮЩИХ ФОТОГРАФИИ ********************************************************************
// массив номеров фотографий в случайном порядке (для url фотографий)
var photosNumber = createArray(1, PHOTOS_QUANTITY).sort(function () {
  return Math.random() - 0.5;
});

// создание комментария к фотографии (из одного или нескольких предложений рандомно)
var createComment = function () {
  var comment = '';

  if (trueOrFalse()) {
    // формируем одно предложение комментария
    comment = getRandomElement(USER_COMMENTS);
  } else {
    // формируем два или более предложений комментария
    var max = randomInteger(2, COMMENT_SENTENCES) - 1;

    for (var i = 0; i < max; i++) {
      comment = comment + getRandomElement(USER_COMMENTS) + ' ';
    }

    // крайнее предложение комментария
    comment = comment + getRandomElement(USER_COMMENTS);
  }

  return comment;
};

// создание массива комментариев к фотографии (количество комментариев от 5 до 10)
var createComments = function () {
  var comments = [];
  var max = randomInteger(5, COMMENTS_QUANTITY);

  for (var i = 0; i < max; i += 1) {
    comments.push(createComment());
  }

  return comments;
};

// генерация массива объектов, описывающих фотографии
for (var i = 0; i < PHOTOS_QUANTITY; i++) {
  var newPhoto = {
    url: 'photos/' + photosNumber[i] + '.jpg',
    likes: randomInteger(MIN_LIKES, MAX_LIKES),
    comments: createComments(),
    description: getRandomElement(PHOTO_DISCRIPTION)
  };

  photosArray.push(newPhoto);
}

// 2. ФОРМИРОВАНИЕ DOM-ЭЛЕМЕНТА соответствующей фотографии и НАПОЛНЕНИЕ ЕГО ДАННЫМИ из массива photoArray ******************
var renderPictureElement = function (element) {
  var elementBlock = pictureTemplate.cloneNode(true);

  elementBlock.querySelector('.picture__img').src = element.url;
  elementBlock.querySelector('.picture__stat--likes').textContent = element.likes;
  elementBlock.querySelector('.picture__stat--comments').textContent = element.comments.length;

  return elementBlock;
};

// 3. ОТРИСОВКА СОЗДАННЫХ DOM-ЭЛЕМЕНТОВ В БЛОК .pictures *******************************************************************
var fragment = document.createDocumentFragment();

for (i = 0; i < photosArray.length; i += 1) {
  fragment.appendChild(renderPictureElement(photosArray[i]));
}

pictureBlock.appendChild(fragment);

// 4. ОВЕРЛЕЙ .big-picture ДЛЯ ФОТО В ПОЛНОЭКРАННОМ РАЗМЕРЕ И КОММЕНТАРИЕВ К НЕЙ
var pictureImages = document.querySelectorAll('.picture__img'); // список фотогафий из блока .pictures
var bigPictureCansel = document.querySelector('.big-picture__cancel');

// формируем данные для оверлея (element - "номер" объекта массива photoArray)
var getBigPictureData = function (element) {
  // url, количество лайков, количество комментариев, описание (случайное из списка)
  bigPictureBlock.querySelector('.big-picture__img').getElementsByTagName('img')[0].src = photosArray[element].url;
  bigPictureBlock.querySelector('.likes-count').textContent = photosArray[element].likes;
  bigPictureBlock.querySelector('.comments-count').textContent = photosArray[element].comments.length;
  bigPictureBlock.querySelector('.social__caption').textContent = getRandomElement(PHOTO_DISCRIPTION);

  // формирование DOM-элемента комментария
  var renderCommentElement = function (elem) {
    var elementBlock = commentTemplate.cloneNode(true);
    var url = 'img/avatar-' + randomInteger(1, 6) + '.svg';

    elementBlock.querySelector('.social__picture').src = url;
    elementBlock.querySelector('.social__text').textContent = elem;

    return elementBlock;
  };

  // формируем комментарии в блок .social__comment
  commentsBlock.innerHTML = ''; // ??? очищаем commentsBlock от ненужных комментариев

  // вставляем 2 первых из списка комментария к фотографии
  for (i = 0; i < 2; i += 1) {
    fragment.appendChild(renderCommentElement(photosArray[element].comments[i]));
  }

  // вставляем комментарии
  commentsBlock.appendChild(fragment);

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

for (i = 0; i < pictureImages.length; i++) {
  pictureImages[i].addEventListener('click', pictureClickHendler);
}

bigPictureCansel.addEventListener('click', bigPictureCloseClickHendler);

// РЕДАКТИРОВАНИЕ ФОТОГРАФИЙ
// текущее (начальное) значение эффекта input radio checked
var effectValue = String(document.querySelector('input[name="effect"]:checked').getAttribute('value'));

var effects = {
  'chrome': {
    filterName: 'grayscale',
    minValue: 0,
    maxValue: 1
  },
  'sepia': {
    filterName: 'sepia',
    minValue: 0,
    maxValue: 1
  },
  'marvin': {
    filterName: 'invert',
    minValue: 0,
    maxValue: 100,
    unit: '%'
  },
  'phobos': {
    filterName: 'blur',
    minValue: 0,
    maxValue: 3,
    unit: 'px'
  },
  'heat': {
    filterName: 'brightness',
    minValue: 1,
    maxValue: 3
  }
};

var textHashtags = document.querySelector('.text__hashtags');
var textDescription = document.querySelector('.text__description');

// открытие и закрытие редактора фотографии (если поля ввода хэштега или комментария не в фокусе)
var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE && document.activeElement !== textHashtags) {
    if (evt.keyCode === ESC_KEYCODE && document.activeElement !== textDescription) {
      closeImageEditor();
    }
  }
};

var openImageEditor = function () {
  imageEditor.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var closeImageEditor = function () {
  imageEditor.classList.add('hidden');
  uploadFile.value = '';
  document.removeEventListener('keydown', onPopupEscPress);
};

// установка положения пина и прогресс-линии
var setPinPosition = function (position) {
  if (position > 100 || position < 0) {
    return;
  }

  scalePin.style.left = position + '%';
  scaleLevel.style.width = position + '%';

  scaleValue.value = position; // обновление значения input пина
};

// "сброс" эффектов фотографии при смене эффекта, установка пина и масштаба фотографии в максимальное положение
var resetEffectLevel = function () {
  imgPreview.removeAttribute('style');
  setPinPosition(SCALE_START);

  // сброс масштаба фотографии
  resizeValue = RESIZE_MAX;
  resizeField.value = RESIZE_MAX + '%';
};

// изменение эффекта фотографии
var changeEffectHendler = function () {
  // сброc эффектов
  resetEffectLevel();

  // обновление текущего значения эффекта (на основе value radio)
  effectValue = String(document.querySelector('input[name="effect"]:checked').getAttribute('value'));

  // убираем слайдер, если выбран "оригинал" фоторафии
  if (effectValue === 'none') {
    scale.style.display = 'none';
  } else {
    scale.style.display = 'block';
  }

  var effectClass = 'effects__preview--' + effectValue; // создание класса эффекта для фотографии
  imgPreview.className = ''; // "чистим" атрибут class у тега img
  imgPreview.classList.add(effectClass); // вставляем нужный класс
};

// изменение уровня эфекта фотографии
var changeEffectLevel = function (level) {
  var filterName = effects[effectValue]['filterName'];
  // var minLevel = effects[effectValue]['minValue'];
  var maxLevel = effects[effectValue]['maxValue'];
  var curentLevel = level * maxLevel / 100;
  var unit = 'unit' in effects[effectValue] ? effects[effectValue]['unit'] : '';

  imgPreview.style.filter = filterName + '(' + curentLevel + unit + ')';
};

uploadFile.addEventListener('change', openImageEditor);
editorCloseBtn.addEventListener('click', closeImageEditor);

changeEffectHendler();

// вешаем обработчик на все радиокнопки кроме первой (на ней слайдер закрывается)
for (i = 0; i < effectButtons.length; i++) {
  effectButtons[i].addEventListener('click', changeEffectHendler);
}

// ПЕРЕМЕЩЕНИЕ ПИНА ********************************************************************************************
// установка начального положения пина и прогресс-линии
resetEffectLevel();

// смена положения пина, прогресс-линии, уровня эфекта в процессе перемещения пина
scalePin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  // стартовое значение координаты X в момент нажатия мыши
  var startX = evt.clientX;

  // обновление координаты X в процессе движения зажатой мыши
  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = startX - moveEvt.clientX;
    startX = moveEvt.clientX;

    var pinPosition = Math.round((scalePin.offsetLeft - shift) * 100 / SCALE_WIDTH); // пиксели в проценты
    setPinPosition(pinPosition); // вызов функции установки положения пина и линии прогресса
    changeEffectLevel(pinPosition);
  };

  // удаление слушетелей движения и отпускания после отпускания миши
  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

// ИЗМЕНЕНИЕ МАСШТАБА ПРЕВЬЮ ФОТОГРАФИИ ************************************************************************
var resizeValue = RESIZE_MAX; // ткущее значение масштаба превью фотографии

var setResize = function (value) {
  resizeField.value = value + '%';
  imgPreview.style.transform = 'scale(' + value * 0.01 + ')';
};

// изменение масштаба
var btnPlusClickHendler = function () {
  if (resizeValue >= RESIZE_MAX) {
    return;
  }

  resizeValue = resizeValue + RESIZE_STEP;
  setResize(resizeValue);
};

var btnMinusClickHendler = function () {
  if (resizeValue <= RESIZE_MIN) {
    return;
  }

  resizeValue = resizeValue - RESIZE_STEP;
  setResize(resizeValue);
};

setResize(RESIZE_MAX);
resizePlus.addEventListener('click', btnPlusClickHendler);
resizeMinus.addEventListener('click', btnMinusClickHendler);

// ВАЛИДАЦИЯ ФОРМЫ
var photoEditForm = document.querySelector('#upload-select-image'); // форма
var fieldHashtag = photoEditForm.querySelector('.text__hashtags'); // поле для хэш-тегов
// var fieldDiscription = photoEditForm.querySelector('.text__description'); // поле для комментария к фотографии

// подстановка и сброс ошибки невалидного поля
var setError = function (field, message) {
  field.setCustomValidity(message);
  field.style.cssText = 'box-shadow: 0 0 3pt 2px red;';
};

var resetError = function (evt) {
  evt.target.setCustomValidity('');
  evt.target.style.cssText = '';
};

// проверяем валидность хэш-тегов
var validateHashtag = function () {

  // поле необязательное, поэтому, если оно пустое, делаем отправку формы
  if (!fieldHashtag.value.length) {
    return true;
  }

  var errorMessage = '';
  var hashtag = fieldHashtag.value.trim(); // с удалением пробелов в начале и в конце

  // делим значение поля с хэш-тегами на отдельные элементы (по пробелу)
  var hashTagArray = hashtag.split(' ');

  // количество решёток в хэш-теге
  var countHashtags = function (stringArray) {
    var count = 0;

    for (var j = 0; j < stringArray.length; j++) {
      if (stringArray[j] === '#') {
        count++;
      }
    }

    return count;
  };

  // количество хэш-тегов без решёток
  var countEmpty = function (array) {
    var count = 0;

    for (i = 0; i < array.length; i++) {
      if (countHashtags(array[i]) === 0) {
        count++;
      }
    }

    return count;
  };

  // количество хэш-тегов без решёток в начале
  var countBeginEmpty = function (array) {
    var count = 0;

    for (i = 0; i < array.length; i++) {
      if (array[i][0] !== '#') {
        count++;
      }
    }

    return count;
  };

  // количество хэш-тегов, состоящих из одной решётки
  var countOnlyHash = function (array) {
    var count = 0;

    for (i = 0; i < array.length; i++) {
      if (array[i].length === 1 && array[i] === '#') {
        count++;
      }
    }

    return count;
  };

  // количество хэш-тегов с лишними решётками
  var countTooMuch = function (array) {
    var count = 0;

    for (i = 0; i < array.length; i++) {
      if (countHashtags(array[i]) > 1) {
        count++;
      }
    }

    return count;
  };

  // поиск неуникальных элементов в массиве
  var findNotUnique = function (array) {
    var result = [];

    for (i = 0; i < array.length; i++) {
      var elem = array[i];

      for (var j = 0; j < result.length; j++) {
        if (elem === result[j]) {
          return true;
        }
      }

      result.push(elem);
    }

    return false;
  };

  // проверяем есть ли решётки в хэш-тегах
  if (countEmpty(hashTagArray) > 0) {
    errorMessage += 'Хэш-теги должны содержать символ решётки! ';
  }

  // проверяем каждый хэш-тег на наличие в его начале решётки
  if (countBeginEmpty(hashTagArray) > 0) {
    errorMessage += 'Решётка должна быть в начале хэш-тега! ';
  }

  // проверяем каждый хэш-тег на отсутствие в нём лишних решёток (кроме первой)
  if (countTooMuch(hashTagArray) > 0) {
    errorMessage += 'В хэш-тегах не должно быть больше одной решётки, или они должны быть разделены пробелами! ';
  }

  // поиск одинаковых хэш-тегов
  if (findNotUnique(hashTagArray)) {
    errorMessage += 'Хэш-теги не должны повторяться! ';
  }

  // поиск одинаковых хэш-тегов
  if (hashTagArray.length > 5) {
    errorMessage += 'Количество хэш-тэгов не может быть более пяти! ';
  }

  // проверяем есть ли тхэш-теги, состоящие только из одной решётки
  if (countOnlyHash(hashTagArray) > 0) {
    errorMessage += 'Хэш-тег не может быть только из одной решётки! ';
  }

  // if (errorMessage.length > 0) {
  //   setError(fieldHashtag, errorMessage);
  // } else {
  //   return true;
  // }

  return errorMessage.length > 0 ? setError(fieldHashtag, errorMessage) : true;
};

var sabmitClickHandler = function (evt) {
  evt.preventDefault();

  if (validateHashtag()) {
    photoEditForm.submit();
  }
};

photoEditForm.addEventListener('submit', sabmitClickHandler);
fieldHashtag.addEventListener('input', resetError);
