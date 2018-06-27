'use strict';

// ОБЩИЕ ДАННЫЕ И МЕТОДЫ
(function () {
  window.app = {
    fragment: document.createDocumentFragment(),

    // формирование массива целых чисел в заданном диапазоне (от...до, включительно)
    createArray: function (min, max) {
      var arr = [];

      for (var i = min; i <= max; i++) {
        arr.push(i);
      }

      return arr;
    },

    // случайное число в заданном диапазоне (от...до, включительно)
    randomInteger: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // получение случайного элемента массива
    getRandomElement: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    // случайное true или false
    trueOrFalse: function () {
      return Math.random() < 0.5;
    }
  };
})();
