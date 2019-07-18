import { render } from './vDom/render/render';
import { detectVNodeChanges, detectComponenetChanges} from './vDom/render/detectVNodeChanges';
import { createElement } from './vDom/createElement/createElement';
import { Reactive, Component } from './component/component';

export default {
  createElement,
  detectVNodeChanges,
  detectComponenetChanges,
  render,
  Reactive,
  Component
}

export {
  createElement,
  detectVNodeChanges,
  detectComponenetChanges,
  render,
  Reactive,
  Component,
}