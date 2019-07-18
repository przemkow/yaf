'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var TEXT_ELEMENT = "TEXT_ELEMENT";
function createVHtmlElement(type, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var rawChildren = children.slice();
    var parsedChildren = rawChildren
        .filter(function (child) { return child != null && child !== false; })
        .map(function (child) { return child instanceof Object ? child : createTextElement(child); });
    var isEvent = function (name) { return name.startsWith("on"); };
    var isAttribute = function (name) { return !isEvent(name) && name != "children"; };
    var attributes = {};
    var on = {};
    for (var propKey in props) {
        if (isAttribute(propKey)) {
            attributes[propKey] = props[propKey];
        }
        else if (isEvent(propKey)) {
            var eventName = propKey.toLowerCase().substring(2);
            on[eventName] = props[propKey];
        }
    }
    return {
        type: type,
        props: {
            attributes: attributes,
            on: on,
            children: parsedChildren,
        }
    };
}
function createTextElement(value) {
    return createVHtmlElement(TEXT_ELEMENT, { nodeValue: value });
}

function isYafComponent(elementType) {
    return typeof elementType === 'function';
}
function isHtmlElement(elementType) {
    return typeof elementType === 'string';
}
function isTextElement(elementType) {
    return elementType === TEXT_ELEMENT;
}

function updateVNodeProps(dom, prevProps, nextProps) {
    prevProps.on = prevProps.on || {};
    prevProps.attributes = prevProps.attributes || {};
    // Remove events
    var eventsToRemove = Object.keys(prevProps.on)
        .reduce(function (acc, prevPropKey) {
        return nextProps.on[prevPropKey] && prevProps.on[prevPropKey].toString() === nextProps.on[prevPropKey].toString() ? acc : acc.concat([prevPropKey]);
    }, []);
    for (var _i = 0, eventsToRemove_1 = eventsToRemove; _i < eventsToRemove_1.length; _i++) {
        var eventName = eventsToRemove_1[_i];
        dom.removeEventListener(eventName, prevProps.on[eventName]);
    }
    // Remove attributes
    var attributesToRemove = Object.keys(prevProps.attributes)
        .reduce(function (acc, prevPropKey) { return prevProps.attributes[prevPropKey] === nextProps.attributes[prevPropKey] ?
        acc : acc.concat([prevPropKey]); }, []);
    for (var _a = 0, attributesToRemove_1 = attributesToRemove; _a < attributesToRemove_1.length; _a++) {
        var attributeName = attributesToRemove_1[_a];
        dom[attributeName] = null;
    }
    // Add event listeners
    var eventsToAdd = Object.keys(nextProps.on)
        .reduce(function (acc, nextPropKey) {
        return prevProps.on[nextPropKey] && prevProps.on[nextPropKey].toString() === nextProps.on[nextPropKey].toString() ? acc : acc.concat([nextPropKey]);
    }, []);
    for (var _b = 0, eventsToAdd_1 = eventsToAdd; _b < eventsToAdd_1.length; _b++) {
        var eventName = eventsToAdd_1[_b];
        dom.addEventListener(eventName, nextProps.on[eventName]);
    }
    // Set attributes
    var attributesToAdd = Object.keys(nextProps.attributes)
        .reduce(function (acc, nextPropKey) { return prevProps.attributes[nextPropKey] === nextProps.attributes[nextPropKey] ?
        acc : acc.concat([nextPropKey]); }, []);
    for (var _c = 0, attributesToAdd_1 = attributesToAdd; _c < attributesToAdd_1.length; _c++) {
        var attributeName = attributesToAdd_1[_c];
        dom[attributeName] = nextProps.attributes[attributeName];
    }
}

function createVNode(element) {
    var type = element.type, props = element.props;
    // Create DOM element
    if (isYafComponent(type)) {
        var Component = type;
        var componentInstance = new Component();
        var childElement = componentInstance.render();
        var childVNodes = createVNode(childElement);
        var dom = childVNodes.dom;
        //export function updateVNode(element, prevVNode, parentHtmlElement) {
        var vNodeInstance = { dom: dom, element: element, childVNodes: childVNodes, componentInstance: componentInstance };
        componentInstance.__internalInstance = vNodeInstance;
        return vNodeInstance;
    }
    else {
        var dom_1 = isTextElement(type) ? document.createTextNode("") : document.createElement(type);
        updateVNodeProps(dom_1, {}, props);
        // Render children
        var childElements = props.children || [];
        var childVNodes = childElements.map(createVNode);
        childVNodes.forEach(function (childVNode) { return dom_1.appendChild(childVNode.dom); });
        var vNodeInstance = { dom: dom_1, element: element, childVNodes: childVNodes };
        return vNodeInstance;
    }
}

function detectVNodeChanges(element, prevVNode, parentHtmlElement) {
    if (prevVNode == null) {
        // Create instance
        var newVNode = createVNode(element);
        parentHtmlElement.appendChild(newVNode.dom);
        return newVNode;
    }
    else if (element == null) {
        // Remove instance
        parentHtmlElement.removeChild(prevVNode.dom);
        return null;
    }
    else if (element.type !== prevVNode.element.type) {
        // Replace instance
        var newVNode = createVNode(element);
        parentHtmlElement.replaceChild(newVNode.dom, prevVNode.dom);
        return newVNode;
    }
    else if (isHtmlElement(element.type)) {
        // Update dom instance
        updateVNodeProps(prevVNode.dom, prevVNode.element.props, element.props);
        prevVNode.element = element;
        prevVNode.childVNodes = updateChildVNodes(element, prevVNode);
        return prevVNode;
    }
    else if (isYafComponent(element.type)) {
        // Update component instance
        var childElement = prevVNode.componentInstance.render();
        var oldChildVNodes = prevVNode.childVNodes;
        var childVNodes = detectVNodeChanges(childElement, oldChildVNodes, parentHtmlElement);
        prevVNode.dom = childVNodes.dom;
        prevVNode.childVNodes = childVNodes;
        prevVNode.element = element;
        return prevVNode;
    }
}
function updateChildVNodes(element, prevVNode) {
    var dom = prevVNode.dom;
    var prevChildVNodes = prevVNode.childVNodes;
    var nextChildElements = element.props.children || [];
    var newChildVNodes = [];
    var count = Math.max(prevChildVNodes.length, nextChildElements.length);
    for (var i = 0; i < count; i++) {
        var childInstance = prevChildVNodes[i];
        var childElement = nextChildElements[i];
        var newChildInstance = detectVNodeChanges(childElement, childInstance, dom);
        newChildVNodes.push(newChildInstance);
    }
    return newChildVNodes.filter(function (vNode) { return vNode; });
}
function detectComponenetChanges(componentInstance) {
    detectVNodeChanges(componentInstance.element, componentInstance, componentInstance.dom.parentNode);
}

var rootVNode = null;
function render(element, htmlRootElement) {
    var prevVNode = rootVNode;
    var newVNode = detectVNodeChanges(element, prevVNode, htmlRootElement);
    rootVNode = newVNode;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function createVComponent(type, props) {
    return {
        type: type,
        props: __assign({}, props)
    };
}

function createElement(type, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var vElement = isYafComponent(type) ?
        // isYafComponent create virtual component
        createVComponent(type, props) : 
    // otherwise it is an an HTML element
    createVHtmlElement.apply(void 0, [type, props].concat(children));
    return vElement;
}

function defineReactiveProperty(target, propertyKey, defaultValue) {
    if (defaultValue === void 0) { defaultValue = undefined; }
    var value = defaultValue;
    Object.defineProperty(target, propertyKey, {
        enumerable: true,
        configurable: true,
        get: function () { return value; },
        set: function (newValue) {
            if (value !== newValue) {
                value = newValue;
            }
            if (this.__internalInstance) {
                detectComponenetChanges(this.__internalInstance);
            }
        },
    });
}
//Property Decorators for component to tell Yaf that defined property needs to be reactive. 
function Reactive() {
    return function (target, propertyKey) {
        defineReactiveProperty(target, propertyKey);
    };
}
function Component() {
    return function (constructor) {
        var newConstructor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var instance = new (constructor.bind.apply(constructor, [void 0].concat(args)))();
            var instanceVariables = Object.keys(instance);
            for (var _a = 0, instanceVariables_1 = instanceVariables; _a < instanceVariables_1.length; _a++) {
                var variable = instanceVariables_1[_a];
                defineReactiveProperty(instance, variable, instance[variable]);
            }
            return instance;
        };
        newConstructor.prototype = constructor.prototype;
        return newConstructor;
    };
}

var index = {
    createElement: createElement,
    detectVNodeChanges: detectVNodeChanges,
    detectComponenetChanges: detectComponenetChanges,
    render: render,
    Reactive: Reactive,
    Component: Component
};

exports.default = index;
exports.createElement = createElement;
exports.detectVNodeChanges = detectVNodeChanges;
exports.detectComponenetChanges = detectComponenetChanges;
exports.render = render;
exports.Reactive = Reactive;
exports.Component = Component;
