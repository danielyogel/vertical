import { init } from '../lib';
import { NodeText, NodeObject, NodeNumber } from './nodes';
import { state as s } from './vertical.stories';

export function initialize(state: typeof s) {
  return init({
    state: state,
    node: NodeObject({
      children: {
        name: NodeText({
          errors: vm => vm.value.get() === 'bla' && [{ message: 'bla is not valid name' }]
        }),
        lastName: NodeText({}),
        age: NodeNumber({})
      }
    })
  });
}
