import { detectVNodeChanges } from './detectVNodeChanges';
import { vElement } from '../createElement/models'
let rootVNode = null;

function render(element: vElement, htmlRootElement: HTMLElement) {
  const prevVNode = rootVNode;
  const newVNode = detectVNodeChanges(element, prevVNode, htmlRootElement)
  rootVNode = newVNode
}

function forceRefresh() {

}

export {
  render,
  forceRefresh
}