declare function Reactive(): (target: any, propertyKey: string) => void;
declare function Component(): <T extends new (...args: any[]) => {}>(constructor: T) => any;
declare const _default: {
    Reactive: typeof Reactive;
    Component: typeof Component;
};
export default _default;
export { Reactive, Component, };
