'use strict';

var aspect = require('./aspect');
var React = require('react');
var _ = require('lodash');
function reactAOP() {

  /**
  Advice –  module of code to be executed (additional behavior you want to apply)
  Pointcut – place in code where an advice should be applied(point of execution, like method names)
  JoinPoints - before, after, round, beforeThrowing, afterThrowing
  Aspect – The combination of the pointcut and the advice is termed an aspect

  **/


  function applyTo(aspectees) {
    var reactComponentAspectees = _.filter(aspectees,function(asp){return typeof asp.componentName === 'string'});
    if(reactComponentAspectees.length){
      aspect.before(React, 'createClass', function(spec) {
        var matchedSpec = _.find(reactComponentAspectees,{componentName:spec.displayName});
        if(matchedSpec){
          aspect[matchedSpec.jointPoint](spec,matchedSpec.pointCut,matchedSpec.advice)
        }
      });
    }
    var moduleAspectees =  _.filter(aspectees,function(asp){return typeof asp.componentName === 'object'});  //tricky but can make sure the componentName is either object or string.
    moduleAspectees.forEach(function(moduleAspectee){
      aspect[moduleAspectee.jointPoint](moduleAspectee.componentName,moduleAspectee.pointCut,moduleAspectee.advice);
    });

  }
  return {applyTo: applyTo}

}

module.exports = reactAOP();
