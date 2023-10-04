import { configure } from 'mobx';
import { observable } from 'mobx';
import './index.css';
import { init } from '../lib';
import { INITIAL_STATE } from './INITIAL_STATE';
import { NodeText, NodeObject } from './nodes';

configure({ enforceActions: 'never' });

const state = observable.box<typeof INITIAL_STATE>(INITIAL_STATE);

const nodeTree = init({
  state: state,
  node: NodeObject({ children: { name: NodeText({ errors: vm => vm.value.get() === 'daniel' && [{ message: 'errorMessage' }] }), lastName: NodeText({}) } })
});

export const Vertical = () => {
  return (
    <div>
      <nodeTree.View />
    </div>
  );
};
