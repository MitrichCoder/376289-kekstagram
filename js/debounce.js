'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  window.debounce = function (applyFunction) {
    var lastTimeout = null;

    return function () {
      var argument = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        applyFunction.apply(null, argument);
      }, DEBOUNCE_INTERVAL);
    };
  };
})();
