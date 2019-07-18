import { isYafComponent, isTextElement } from '../utils';
import { updateVNodeProps } from './updateVNodeProps';

function createVNode(element) {
  const { type, props } = element;

  // Create DOM element
  if(isYafComponent(type)) {
    const Component = type;
    const componentInstance = new Component();
    const childElement = componentInstance.render();
    const childVNodes = createVNode(childElement);
    const dom = childVNodes.dom;

    //export function updateVNode(element, prevVNode, parentHtmlElement) {
    const vNodeInstance = { dom, element, childVNodes, componentInstance };
    componentInstance.__internalInstance = vNodeInstance;
    return vNodeInstance;

  } else {
    const dom = isTextElement(type) ? document.createTextNode("") : document.createElement(type);
    updateVNodeProps(dom, {}, props)

    // Render children
    const childElements = props.children || [];
    const childVNodes = childElements.map(createVNode);
  
    childVNodes.forEach(childVNode => dom.appendChild(childVNode.dom));
  
    const vNodeInstance = { dom, element, childVNodes };
    return vNodeInstance;
  }
}

export {
  createVNode,
}