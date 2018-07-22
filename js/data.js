'use strict';

// ГЕНЕРАЦИЯ МАССИВА ОБЪЕКТОВ, ОПИСЫВАЮЩИХ ФОТОГРАФИИ
(function () {
  window.data = {
    photos: [],
    PHOTO_DISCRIPTION: ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья.\nНе обижайте всех словами......', 'Вот это тачка!']
  };

  // формирование нового массива обектов для фотографий
  var onSuccess = function (newData) {
    // массив чисел в случайном порядке
    var randomOrders = window.app.createArray(0, newData.length - 1).sort(function () {
      return Math.random() - 0.5;
    });

    for (var i = 0; i < newData.length; i++) {
      var testPhoto = {
        url: newData[randomOrders[i]].url,
        likes: newData[randomOrders[i]].likes,
        comments: newData[randomOrders[i]].comments,
        description: window.app.getRandomElement(window.data.PHOTO_DISCRIPTION)
      };

      window.data.photos.push(testPhoto);
    }

    window.renderPictures(window.data.photos);
    window.preview();
  };

  window.backend.load(onSuccess, window.app.onError);
})();
