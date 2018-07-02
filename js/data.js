'use strict';

// ГЕНЕРАЦИЯ МАССИВА ОБЪЕКТОВ, ОПИСЫВАЮЩИХ ФОТОГРАФИИ
(function () {
  window.data = {
    photosArray: [],
    PHOTO_DISCRIPTION: ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья.\nНе обижайте всех словами......', 'Вот это тачка!']
  };

  // формирование нового массива обектов для фотографий
  var onSuccess = function (dataArray) {
    // массив чисел в случайном порядке
    var randomOrder = window.app.createArray(0, dataArray.length - 1).sort(function () {
      return Math.random() - 0.5;
    });

    for (var i = 0; i < dataArray.length; i++) {
      var testPhoto = {
        url: dataArray[randomOrder[i]].url,
        likes: dataArray[randomOrder[i]].likes,
        comments: dataArray[randomOrder[i]].comments,
        description: window.app.getRandomElement(window.data.PHOTO_DISCRIPTION)
      };

      window.data.photosArray.push(testPhoto);
    }

    window.pictures();
    window.preview();
  };

  var onError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.load(onSuccess, onError);
})();
