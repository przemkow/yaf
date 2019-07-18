export declare type ElementType = String | Function;
export interface vHtmlElementAttribute {
    [key: string]: string;
}
export interface vHtmlElementEvent {
    [key: string]: HTMLElementEventMap;
}
export interface vHtmlElementProps {
    attributes: vHtmlElementAttribute;
    on: vHtmlElementEvent;
    children: vHtmlElement[];
}
export interface vHtmlElement {
    type: string;
    props: vHtmlElementProps;
}
export interface vComponent {
    type: Function;
    props: any;
}
export declare type vElement = vHtmlElement | vComponent;
