import { IComputedValue } from 'mobx';
// import { NodeString, NodeObject, NodeNumber } from '..';
// import RenderString from './NodeString/Render';
// import RenderNumber from './NodeNumber/Render';
// import Render from './NodeObject/Render';

type NodeInfer<F> = F extends (args: infer V) => any ? (V extends { value: IComputedValue<infer Z> } ? Z : never) : never;

export type GetVal<T extends Record<string, any>> = {
  [K in keyof T]: NodeInfer<T[K]>;
};

// type StringN = ReturnType<ReturnType<typeof NodeString>>;

// type testResultNodeInfer = NodeInfer<StringN>;

export type GetArrayVal<T extends ReadonlyArray<any>> = {
  [K in keyof T]: NodeInfer<T[K]>;
};

// const StringN = NodeString({ Render: RenderString });
// const NumberN = NodeNumber({ Render: RenderNumber });

// const ObjectN = NodeObject({ Render });

// const node = ObjectN({
//   children: {
//     name: StringN({ label: 'Name' })
//   }
// });

// const nodeB = ObjectN({
//   children: {
//     nameB: NumberN({ label: 'Name' })
//   }
// });

// const objArr = [node, nodeB] as const;

// type ArrResult = GetArrayVal<typeof objArr>;

// type one = ArrResult[0]['name'];
// type two = ArrResult[1]['nameB'];
