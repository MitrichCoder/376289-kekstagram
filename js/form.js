'use strict';

// ФОРМА РЕДАКТИРОВАНИЯ ФОТОГРАФИЙ
(function () {
  var ESC_KEYCODE = 27;

  var SCALE_WIDTH = 453; // общая ширина scale у пина
  var SCALE_START = 100; // начальное значение положения пина и прогресс-линии в %

  var RESIZE_MAX = 100; // максимальное значение масштаба превью фотографии
  var RESIZE_MIN = 25; // минимальное значение масштаба превью фотографии
  var RESIZE_STEP = 25; // шаг изменения масштаба превью фотографии

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

  // открытие и закрытие редактора фотографии (если поля ввода хэштега или комментария в фокусе)
  var onPopupEscPress = function (evt) {
    if ((evt.keyCode === ESC_KEYCODE) && (document.activeElement !== textHashtags) && (document.activeElement !== textDescription)) {
      closeImageEditor();
    }
  };

  var openImageEditor = function () {
    resetEffectLevel();
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
  for (var i = 0; i < effectButtons.length; i++) {
    effectButtons[i].addEventListener('click', changeEffectHendler);
  }

  // ПЕРЕМЕЩЕНИЕ ПИНА
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

    // удаление слушетелей движения и отпускания после отпускания мыши
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // ИЗМЕНЕНИЕ МАСШТАБА ПРЕВЬЮ ФОТОГРАФИИ
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
})();
