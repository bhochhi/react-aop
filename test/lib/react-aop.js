'use strict';
var React = require('react');
var expect = require('chai').expect;
var sinon = require('sinon');
describe('Given a react-aop module', function() {
  var reactAOP;
  beforeEach(function() {
    reactAOP = require('../../src/lib/react-aop');
  });
  describe('And I have specification for the react component to test before crosspoint', function() {
    var MockComponent, specs, result=[];
    beforeEach(function() {
      specs = {
        displayName: 'MockComponent',
        method1: function(name) {
          result.push('method1Called');
          return 'Return value from method1';
        },
        render: function() {
          return null;
        }
      };
    });
    describe('And I have before crosspoint set on component method call method1', function() {
      var aspectees, adviceOnMethod1, spyAdvice;
      beforeEach(function() {
        adviceOnMethod1 = function(name) {
          result.push('adviceCalled');
        };
        spyAdvice = sinon.spy(adviceOnMethod1);
        aspectees = [{
          componentName: 'MockComponent',
          jointPoint: 'before',
          pointCut: 'method1',
          advice: spyAdvice
        }];
        reactAOP.applyTo(aspectees);
      });
      describe('When I call its method on pointcut with "Hello" as argument', function() {
        var reactComponentInstance;
        beforeEach(function() {
          MockComponent = React.createClass(specs);
          reactComponentInstance = new MockComponent();
          reactComponentInstance.method1('Hello');

        });
        it('Should complete advice method execution before crosspoint execution', function() {
          expect(spyAdvice.withArgs('Hello').calledOnce).to.be.true;
          expect(result).to.eql(['adviceCalled', 'method1Called']);
        });
      });
    });

  });

  describe('And I have specification for the react component to test after crosspoint', function() {
    var MockComponent, specs, result=[];
    beforeEach(function() {
      specs = {
        displayName: 'MockComponent',
        method1: function(name) {
          result.push('method1Called');
          return 'Return value from method1';
        },
        render: function() {
          return null;
        }
      };
    });

    describe('And I have after crosspoint set on component method call method1', function() {
      var aspectees, adviceOnMethod1After, spyAdvice;
      beforeEach(function() {
        adviceOnMethod1After = function(name) {
          result.push('adviceCalled');
        };
        spyAdvice = sinon.spy(adviceOnMethod1After);
        aspectees = [{
          componentName: 'MockComponent',
          jointPoint: 'after',
          pointCut: 'method1',
          advice: spyAdvice
        }];
        reactAOP.applyTo(aspectees);
      });
      describe('When I call its method on pointcut with "Hello" as argument', function() {
        var reactComponentInstance;
        beforeEach(function() {
          MockComponent = React.createClass(specs);
          reactComponentInstance = new MockComponent();
          reactComponentInstance.method1('Hello');
        });
        it('Should call advice method once with result of pointcut as first argument and parameters of method1 as consecutive arguments after method1', function() {
          expect(spyAdvice.calledOnce).to.be.true;
          expect(spyAdvice.withArgs('Return value from method1', 'Hello').calledOnce).to.be.true;
          expect(result).to.eql(['method1Called', 'adviceCalled']);
        });
      });
    });
  });

  describe('And I have a general module',function(){
    var mockModule,result = [];
    beforeEach(function(){
      mockModule = {
        method1:function(name){result.push('method1Called')},
        someOtherMethod:function(){}
      }
    });
    describe('And I have before crosspoint on its method call method1',function(){
      var aspectees, adviceOnMethod1, spyAdvice;
      beforeEach(function() {
        adviceOnMethod1 = function(name) {
          result.push('adviceCalled');
        };
        spyAdvice = sinon.spy(adviceOnMethod1);
        aspectees = [{
          componentName: mockModule,
          jointPoint: 'before',
          pointCut: 'method1',
          advice: spyAdvice
        }];
        reactAOP.applyTo(aspectees);
      });
      describe('When I call method1',function(){
        beforeEach(function(){
          mockModule.method1('Hello');
        });
        it('Should call the advice method once with "Hello" argument before calling method1 ',function(){
          expect(spyAdvice.calledOnce).to.be.true;
          expect(spyAdvice.withArgs('Hello').calledOnce).to.be.true;
          expect(result).to.eql(['adviceCalled', 'method1Called']);
        });
      });
    });
  });
});
