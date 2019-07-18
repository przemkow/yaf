import { isYafComponent } from '../utils';
import { createVComponent } from './vComponent';
import { createVHtmlElement } from './vHtmlElement';
import { ElementType, vElement } from './models';


function createElement(type: ElementType, props, ...children): vElement {
  const vElement = isYafComponent(type) ? 
    // isYafComponent create virtual component
    createVComponent(<Function>type, props) : 
    // otherwise it is an an HTML element
    createVHtmlElement(<string>type, props, ...children);
  
  return vElement;
}

export {
  createElement,
}


