import { detectComponenetChanges } from '../vDom/render/detectVNodeChanges'

function defineReactiveProperty(target, propertyKey, defaultValue = undefined) {
  let value = defaultValue;

  Object.defineProperty(target, propertyKey, {
    enumerable: true,
    configurable: true,
    get() { return value; },
    set(newValue) { 
      if(value !== newValue){
        value = newValue
      }
      if(this.__internalInstance) {
        detectComponenetChanges(this.__internalInstance)
      }
    },
  })
}

//Property Decorators for component to tell Yaf that defined property needs to be reactive. 
function Reactive() {
  return function(target, propertyKey: string) {
    defineReactiveProperty(target, propertyKey);
  }
}

function Component() {
  return function<T extends {new(...args:any[]):{}}>(constructor: T) {

    const newConstructor: any = function(...args) {
      const instance = new constructor(...args);
      const instanceVariables = Object.keys(instance);
      for(let variable of instanceVariables) {
        defineReactiveProperty(instance, variable, instance[variable]);
      }
      return instance;
    };

    newConstructor.prototype = constructor.prototype;

    return newConstructor
  }
}

export default {
  Reactive,
  Component,
}

export {
  Reactive,
  Component,
}