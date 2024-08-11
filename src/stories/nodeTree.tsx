import { init } from '../lib';
import { NodeText, NodeObject, NodeNumber } from './nodes';
import { state as s } from './INITIAL_STATE';

export function initialize(state: typeof s) {
  return init({
    state: state,
    node: NodeObject({
      isVisible({ value, store }) {
        const v = store.get();
        return true;
      },
      children: {
        name: NodeText({
          errors({ value, store }) {
            return store.get() ? undefined : undefined;
          }
        }),
        lastName: NodeText({}),
        age: NodeNumber({}),
        details: NodeObject({
          children: {
            future: NodeText({
              isVisible({ value, store }) {
                const s = store.get();
                const v = value.get();
                return true;
              }
            })
          }
        })
      }
    })
  });
}
