'use strict';

// ВАЛИДАЦИЯ ФОРМЫ
(function () {
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

    // поле необязательное, поэтому, если оно пустое, сразу делаем отправку формы
    if (!fieldHashtag.value.length) {
      return true;
    }

    var errorsObj = {}; // сюда "складываем" ошибки
    var errorMessage = '';

    var hashtag = fieldHashtag.value.trim().toLowerCase(); // избавляемся от пробелов в начале и в конце, приводим к одному регистру
    var hashTagArray = hashtag.split(' '); // делим значение поля с хэш-тегами на отдельные элементы (по пробелу)

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

    // поиск одинаковых элементов в массиве
    var findNotUnique = function (array) {
      var object = {};

      for (var i = 0; i < array.length; i++) {
        var str = array[i];

        if (object[str] === undefined) {
          object[str] = true;
        } else {
          return true;
        }
      }

      return false;
    };

    // не больше ли 5 хэш-тегов?
    if (hashTagArray.length > 5) {
      errorsObj.error1 = 'Хэш-тегов больше пяти. ';
    }

    // есть ли одинаковые хэщтеги?
    if (findNotUnique(hashTagArray)) {
      errorsObj.error2 = 'Есть одинаковые хэш-теги. ';
    }

    // проверяем каждый хэш-тег
    for (var i = 0; i < hashTagArray.length; i++) {
      // есть ли решётка в начале?
      if (hashTagArray[i][0] !== '#') {
        errorsObj.error3 = 'Нет решётки в начале хэш-тега. ';
      }

      // не из одной ли решётки?
      if (hashTagArray[i].length === 1 && hashTagArray[i][0] === '#') {
        errorsObj.error4 = 'Хэш-тег состоит из одной решётки. ';
      }

      // не больше ли 20 знаков
      if (hashTagArray[i].length > 20) {
        errorsObj.error5 = 'Хэш-тег больше 20 знаков. ';
      }

      // разделяются ли хэш-теги пробелом?
      if (countHashtags(hashTagArray[i]) > 1) {
        errorsObj.error6 = 'Нет пробелов между хэш-тегами. ';
      }
    }

    // формируем сообщение с ошибками
    for (var key in errorsObj) {
      if (errorsObj.hasOwnProperty(key)) {
        errorMessage += errorsObj[key];
      }
    }

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
})();
