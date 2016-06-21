**Senario**

Suppose you have a react application, let say with flux architecture. You want to track various data as per user interaction. One way to accomplish this is add the lines of codes into the react component methods which will get executed and intented data is available. But doing so would be very invasive and violates certain clean code principles. Better way of implementing such cross-cutting concern like collecting data from various methods within react component specification is through [Aspect Oriented Programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming) approach.

**Terms**  
  *Advice* –  module of code to be executed (additional behavior you want to apply)  
  *Pointcut* – place in code where an advice should be applied(point of execution, like method names)  
  *JoinPoints* - before, after (will add more in future)
  *Aspect* – The combination of the pointcut and the advice is termed an aspect

**JoinPoints**  
* _before_- advice will be fired before pointcut is executed. Here the arguments would be exactly same as PointCut arguments in order.
* _after_- advice will be fired just after pointcut is executed. Here the first argument is the return value of pointcut and remaining arguments would be initial arguments of pointcut function.

**Usages**  
```npm install --save react-aop```

Add following code before requiring any react components from where you intent to collect the data and before calling ReactDOM.render function. So, in your entry js file:  
```
var react-aop = require('react-aop');
var usuages = require('./common/usages');
react-aop.register(usuages);
```

In the above code usages is an array of all possible aspects you want to add. for instance: usages.js

```

exports.usages = [
{
  componentName: 'ReactComponentDisplayName',
  jointPoint: 'before',  
  pointCut: 'method',
  advice: adviceOnMethod
},
{
  componentName: GeneralModule,
  jointPoint: 'after',
  pointCut: 'method',
  advice: adviceOnMethod
}
]
```
All fields are required. _joinPoint_ and _pointCut_ are string, _advice_ is a function type and componentName can be string( for react component) or object( for any generic node module);

**Caveat - WorkAround**

This version (1.0.3), uses a workaround when you have to add advice(extra behavior) on certain method of React Component. Since I were not able to get hold of Backing Instance of react Component (similar to one return by ReactDOM.render) for all child components(I tried with ReactTestUtils and ref props.), whenever pointcut method internally call methods or properties within itself(using _this_), we can not use such method as pointcut anymore. So, the workaround for now is create the separate method _hookMethod( just signature is sufficient) and invoke this method from your originally intended pointcut method, and make _hookMethod as your pointcut method. For Instance:

original input to apply AOP:  
```
[{
   componentName: 'ReactComponentDisplayName',
  jointPoint: 'before',  
  pointCut: 'methodX',
  advice: adviceOnMethod
}]
```  
if methodX looks like:  
```
methodX = function(params){
 ..
 this.setState({field:params});
}
```  
then you can't make methodX as your pointcut. You need to modify such method as:  
```
..
methodX = function(params){
 ..
 this._aopHook();
 this.setState({field:params});
},
_aopHook = function(){}
```
And your input for AOP will be:  
```
[{
   componentName: 'ReactComponentDisplayName',
  jointPoint: 'before',  
  pointCut: '_aopHook',
  advice: adviceOnMethod
}]
```  
I understand this is not perfect, but until we find the better [solution](https://github.com/bhochhi/react-aop/issues/1), current approach provides proximity to AOP for react based applications. 
