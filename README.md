**Senario**

Suppose you have a react application, let say with flux architecture. You want to track various data as per user interaction. One way to accomplish this is add the lines of codes into the react component methods which will get executed and intented data is available. But doing so would be very invasive and violates certain clean code principles. Better way of implementing such cross-cutting concern like collecting data from various methods within react component specification is through [Aspect Oriented Programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming) approach. 

**Terms**

  **Advice** –  module of code to be executed (additional behavior you want to apply)  
  **Pointcut** – place in code where an advice should be applied(point of execution, like method names)  
  **JoinPoints** - before, after, round, beforeThrowing, afterThrowing  
  **Aspect** – The combination of the pointcut and the advice is termed an aspect



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

var usages = [

{


}


]



module.exports = usuages;
```

