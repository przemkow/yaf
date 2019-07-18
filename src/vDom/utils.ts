import { TEXT_ELEMENT } from './createElement/vHtmlElement';
import { ElementType } from './createElement/models';

function isYafComponent(elementType: ElementType): Boolean {
  return typeof elementType === 'function';
}

function isHtmlElement(elementType: ElementType): Boolean {
  return typeof elementType === 'string';
}
function isTextElement(elementType: ElementType): Boolean {
  return elementType === TEXT_ELEMENT;
}

export {
  isYafComponent,
  isHtmlElement,
  isTextElement,
}