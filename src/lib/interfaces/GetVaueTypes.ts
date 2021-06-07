import { IComputedValue } from 'mobx';

type NodeInfer<F> = F extends (args: infer V) => any ? (V extends { value: IComputedValue<infer Z> } ? Z : never) : never;

export type GetVal<T extends Record<string, any>> = {
  [K in keyof T]: NodeInfer<T[K]>;
};

export type GetArrayVal<T extends ReadonlyArray<any>> = {
  [K in keyof T]: NodeInfer<T[K]>;
};
