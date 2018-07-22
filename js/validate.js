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

    var errorsObject = {}; // сюда "складываем" ошибки
    var errorMessage = '';

    var hashtag = fieldHashtag.value.trim().toLowerCase(); // избавляемся от пробелов в начале и в конце, приводим к одному регистру
    var hashTags = hashtag.split(' '); // делим значение поля с хэш-тегами на отдельные элементы (по пробелу)

    // количество решёток в хэш-теге
    var countHashtags = function (string) {
      var count = 0;

      for (var j = 0; j < string.length; j++) {
        if (string[j] === '#') {
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
    if (hashTags.length > 5) {
      errorsObject.errorNumberOne = 'Хэш-тегов больше пяти. ';
    }

    // есть ли одинаковые хэщтеги?
    if (findNotUnique(hashTags)) {
      errorsObject.errorNumberTwo = 'Есть одинаковые хэш-теги. ';
    }

    // проверяем каждый хэш-тег
    for (var i = 0; i < hashTags.length; i++) {
      // есть ли решётка в начале?
      if (hashTags[i][0] !== '#') {
        errorsObject.errorNumberThree = 'Нет решётки в начале хэш-тега. ';
      }

      // не из одной ли решётки?
      if (hashTags[i].length === 1 && hashTags[i][0] === '#') {
        errorsObject.errorNumberFour = 'Хэш-тег состоит из одной решётки. ';
      }

      // не больше ли 20 знаков
      if (hashTags[i].length > 20) {
        errorsObject.errorNumberFive = 'Хэш-тег больше 20 знаков. ';
      }

      // разделяются ли хэш-теги пробелом?
      if (countHashtags(hashTags[i]) > 1) {
        errorsObject.errorNumberSix = 'Нет пробелов между хэш-тегами. ';
      }
    }

    // формируем сообщение с ошибками
    for (var key in errorsObject) {
      if (errorsObject.hasOwnProperty(key)) {
        errorMessage += errorsObject[key];
      }
    }

    return errorMessage.length > 0 ? setError(fieldHashtag, errorMessage) : true;
  };

  fieldHashtag.addEventListener('input', resetError);

  var onSuccess = function () {
    window.form.closeImageEditor();
  };

  photoEditForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    if (validateHashtag()) {
      window.backend.save(new FormData(photoEditForm), onSuccess, window.app.onError);
    }
  });
})();
