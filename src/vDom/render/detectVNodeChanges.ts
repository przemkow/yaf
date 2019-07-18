import { isYafComponent, isHtmlElement } from '../utils';
import { createVNode } from './createVNode';
import { updateVNodeProps } from './updateVNodeProps';

import { vElement } from '../createElement/models'

function detectVNodeChanges(element: vElement, prevVNode, parentHtmlElement: HTMLElement) {
  if(prevVNode == null)  {
    // Create instance
    const newVNode = createVNode(element);
    parentHtmlElement.appendChild(newVNode.dom);    
    return newVNode;
  } else if (element == null) {
    // Remove instance
    parentHtmlElement.removeChild(prevVNode.dom);
    return null;
  } else if(element.type !== prevVNode.element.type) {
    // Replace instance
    const newVNode = createVNode(element);
    parentHtmlElement.replaceChild(newVNode.dom, prevVNode.dom);
    return newVNode;
  } else if(isHtmlElement(element.type)) {
    // Update dom instance
    updateVNodeProps(prevVNode.dom, prevVNode.element.props, element.props);
    prevVNode.element = element;
    prevVNode.childVNodes = updateChildVNodes(element, prevVNode);
    return prevVNode;
  } else if(isYafComponent(element.type)){
    // Update component instance
    const childElement = prevVNode.componentInstance.render();
    const oldChildVNodes = prevVNode.childVNodes;
    const childVNodes = detectVNodeChanges(childElement, oldChildVNodes, parentHtmlElement);
    prevVNode.dom = childVNodes.dom;
    prevVNode.childVNodes = childVNodes;
    prevVNode.element = element;
    return prevVNode;
  }
}

function updateChildVNodes(element, prevVNode) {
  const dom = prevVNode.dom;
  const prevChildVNodes = prevVNode.childVNodes;
  const nextChildElements = element.props.children || [];
  const newChildVNodes = [];
  const count = Math.max(prevChildVNodes.length, nextChildElements.length);
  for (let i = 0; i < count; i++) {
    const childInstance = prevChildVNodes[i];
    const childElement = nextChildElements[i];
    const newChildInstance = detectVNodeChanges(childElement, childInstance, dom);
    newChildVNodes.push(newChildInstance);
  }
  return newChildVNodes.filter(vNode => vNode);
}

function detectComponenetChanges(componentInstance) {
  detectVNodeChanges(componentInstance.element, componentInstance, componentInstance.dom.parentNode)
}

export {
  detectVNodeChanges,
  detectComponenetChanges,
}