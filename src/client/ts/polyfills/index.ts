/* tslint:disable */
// creates a global "addWheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
(function(window, document) {
  let prefix = '',
    _addEventListener,
    support;

  // detect event model
  if ((window as any).addEventListener) {
    _addEventListener = 'addEventListener';
  } else {
    _addEventListener = 'attachEvent';
    prefix = 'on';
  }

  // detect available wheel event
  support =
    'onwheel' in document.createElement('div')
      ? 'wheel' // Modern browsers support "wheel"
      : (document as any).onmousewheel !== undefined
      ? 'mousewheel' // Webkit and IE support at least "mousewheel"
      : 'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

  window.addWheelListener = function(elem, callback, useCapture) {
    _addWheelListener(elem, support, callback, useCapture);

    // handle MozMousePixelScroll in older Firefox
    if (support == 'DOMMouseScroll') {
      _addWheelListener(elem, 'MozMousePixelScroll', callback, useCapture);
    }
  };

  function _addWheelListener(elem, eventName, callback, useCapture) {
    elem[_addEventListener](
      prefix + eventName,
      support == 'wheel'
        ? callback
        : function(originalEvent) {
            !originalEvent && (originalEvent = window.event);

            // create a normalized event object
            let event = {
              // keep a ref to the original event object
              originalEvent,
              target: originalEvent.target || originalEvent.srcElement,
              type: 'wheel',
              deltaMode: originalEvent.type == 'MozMousePixelScroll' ? 0 : 1,
              deltaX: 0,
              deltaY: 0,
              deltaZ: 0,
              preventDefault() {
                originalEvent.preventDefault
                  ? originalEvent.preventDefault()
                  : (originalEvent.returnValue = false);
              },
            };

            // calculate deltaY (and deltaX) according to the event
            if (support == 'mousewheel') {
              event.deltaY = (-1 / 40) * originalEvent.wheelDelta;
              // Webkit also support wheelDeltaX
              originalEvent.wheelDeltaX &&
                (event.deltaX = (-1 / 40) * originalEvent.wheelDeltaX);
            } else {
              event.deltaY = originalEvent.deltaY || originalEvent.detail;
            }

            // it's time to fire the callback
            return callback(event);
          },
      useCapture || false
    );
  }
})(window, document);

// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
  Array.from = (function() {
    let toStr = Object.prototype.toString;
    let isCallable = function(fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    let toInteger = function(value) {
      let number = Number(value);
      if (isNaN(number)) {
        return 0;
      }
      if (number === 0 || !isFinite(number)) {
        return number;
      }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    let maxSafeInteger = Math.pow(2, 53) - 1;
    let toLength = function(value) {
      let len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike /*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      let C = this;

      // 2. Let items be ToObject(arrayLike).
      let items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError(
          'Array.from requires an array-like object - not null or undefined'
        );
      }

      // 4. If mapfn is undefined, then let mapping be false.
      let mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      let T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError(
            'Array.from: when provided, the second argument must be a function'
          );
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      let len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      let A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      let k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      let kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] =
            typeof T === 'undefined'
              ? mapFn(kValue, k)
              : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  })();
}
