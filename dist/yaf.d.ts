import { render } from './vDom/render/render';
import { detectVNodeChanges, detectComponenetChanges } from './vDom/render/detectVNodeChanges';
import { createElement } from './vDom/createElement/createElement';
import { Reactive, Component } from './component/component';
declare const _default: {
    createElement: typeof createElement;
    detectVNodeChanges: typeof detectVNodeChanges;
    detectComponenetChanges: typeof detectComponenetChanges;
    render: typeof render;
    Reactive: typeof Reactive;
    Component: typeof Component;
};
export default _default;
export { createElement, detectVNodeChanges, detectComponenetChanges, render, Reactive, Component, };
