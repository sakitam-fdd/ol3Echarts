declare const isObject: (value: any) => boolean;
declare const merge: (a: any, b: any) => any;
declare const bind: (func: Function, context: any, ...args: any[]) => Function;
declare const arrayAdd: (array: any[], item: any) => any[];
declare const uuid: () => string;
declare function bindAll(fns: string[] | number[], context: any): void;
declare function removeNode(node: HTMLElement): HTMLElement | null;
export { merge, isObject, bind, arrayAdd, uuid, bindAll, removeNode, };
