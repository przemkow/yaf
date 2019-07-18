const TEXT_ELEMENT = "TEXT_ELEMENT";
import { vHtmlElement } from './models';

function createVHtmlElement(type: string, props, ...children): vHtmlElement {
  const rawChildren = [...children];
  const parsedChildren = rawChildren
    .filter(child => child != null && child !== false)
    .map(child => child instanceof Object ? child : createTextElement(child));

  const isEvent = name => name.startsWith("on");
  const isAttribute = name => !isEvent(name) && name != "children";
  
  let attributes = {};
  let on = {};
  for(let propKey in props) {
    if(isAttribute(propKey)) {
      attributes[propKey] = props[propKey]
    } else if(isEvent(propKey)) {
      const eventName = propKey.toLowerCase().substring(2)
      on[eventName] = props[propKey]
    }
  }

  return { 
    type, 
    props: {
      attributes,
      on,
      children: parsedChildren,
    }  
  };
}

function createTextElement(value) {
  return createVHtmlElement(TEXT_ELEMENT, { nodeValue: value });
}

export {
  createVHtmlElement,
  TEXT_ELEMENT,
}