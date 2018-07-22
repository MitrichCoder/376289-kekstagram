'use strict';

// ОБЩИЕ ДАННЫЕ И МЕТОДЫ
(function () {
  window.app = {
    fragment: document.createDocumentFragment(),

    // формирование массива целых чисел в заданном диапазоне (от...до, включительно)
    createArray: function (min, max) {
      var array = [];

      for (var i = min; i <= max; i++) {
        array.push(i);
      }

      return array;
    },

    // случайное число в заданном диапазоне (от...до, включительно)
    randomInteger: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // получение случайного элемента массива
    getRandomElement: function (array) {
      return array[Math.floor(Math.random() * array.length)];
    },

    // получение массива определённого количества случайных чисел в заданном диапазоне
    getRandomArray: function (limit, min, max) {
      var randomNumbers = [];

      while (randomNumbers.length !== limit) {
        var num = window.app.randomInteger(min, max);

        if (!randomNumbers.includes(num)) {
          randomNumbers.push(num);
        }
      }

      return randomNumbers;
    },

    // случайное true или false
    getTrueOrFalse: function () {
      return Math.random() < 0.5;
    },

    // создание DOM-элемента
    makeElement: function (tagName, className) {
      var element = document.createElement(tagName);
      element.classList.add(className);
      return element;
    },

    // ощибка отправки или загрузки
    onError: function (errorMessage) {
      var errorWindow = window.app.makeElement('div', 'error');
      var errorOverlay = window.app.makeElement('div', 'error-overlay');

      errorWindow.innerHTML = '<svg class="error__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 507.2 507.2"><circle cx="253.6" cy="253.6" r="253.6" fill="#f15249"/><path d="M147.2 368L284 504.8c115.2-13.6 206.4-104 220.8-219.2L367.2 148l-220 220z" fill="#ad0e0e"/><path d="M373.6 309.6c11.2 11.2 11.2 30.4 0 41.6l-22.4 22.4c-11.2 11.2-30.4 11.2-41.6 0l-176-176c-11.2-11.2-11.2-30.4 0-41.6l23.2-23.2c11.2-11.2 30.4-11.2 41.6 0l175.2 176.8z" fill="#FFF"/><path d="M280.8 216L216 280.8l93.6 92.8c11.2 11.2 30.4 11.2 41.6 0l23.2-23.2c11.2-11.2 11.2-30.4 0-41.6L280.8 216z" fill="#d6d6d6"/><path d="M309.6 133.6c11.2-11.2 30.4-11.2 41.6 0l23.2 23.2c11.2 11.2 11.2 30.4 0 41.6L197.6 373.6c-11.2 11.2-30.4 11.2-41.6 0l-22.4-22.4c-11.2-11.2-11.2-30.4 0-41.6l176-176z" fill="#FFF"/></svg><h2 class="error__title">OOOPS!</h2><p class="error__text"></p><a class="error__button"href="index.html">Try again!</a>';
      errorWindow.querySelector('.error__text').textContent = errorMessage;

      document.body.insertAdjacentElement('afterbegin', errorWindow);
      errorWindow.parentNode.insertBefore(errorOverlay, errorWindow.nextSibling);

      var error = document.querySelector('.error__button');
      var uploadFile = document.querySelector('#upload-file');

      error.addEventListener('click', function (evt) {
        evt.preventDefault();

        document.body.removeChild(errorWindow);
        document.body.removeChild(errorOverlay);

        uploadFile.value = '';
      });
    }
  };
})();
