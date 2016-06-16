'use strict';

function aspect() {
  function validateArguments() {
    if (arguments.length !== 3) {
      throw new Error('jointpoint requires three parameter');
    }
    if (typeof arguments[0] !== 'object') {
      throw new Error('jointpoint requires an object-type as first parameter.');
    }
    if (typeof arguments[1] !== 'string') {
      throw new Error('Aspect requires an string-type pointcut as second parameter.');
    }
    if (typeof arguments[2] !== 'function') {
      throw new Error('Aspect requires an function-type advice as third parameter".');
    }
  }

  function before(context, pointcut, advice) {
    validateArguments.apply(this,arguments);
    var original = context[pointcut];
    context[pointcut] = function() {
      advice.apply(null, arguments);
      return original.apply(null, arguments); //TODO: find the way to pass object instance (context) incase original method is referencing **this**.
    };
  }

  function after(context, pointcut, advice) {
    validateArguments.apply(this,arguments);
    var original = context[pointcut];
    context[pointcut] = function() {
      var output;
      var args = Array.prototype.slice.call(arguments, 0);
      try {
        output = original.apply(null, arguments);
        args.unshift(output);
        advice.apply(null, args);
        return output;
      } catch (err) {
        // letting aspect to complete even after exception
        output = err;
        args.unshift(output);
        advice.apply(null, args);
        throw new Error('after jointpoint:', err);
      }
    };
  }

  return {
    before: before,
    after: after
  };
}

module.exports = aspect();
