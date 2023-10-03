import { computed, configure } from 'mobx';
import { observable } from 'mobx';
import './index.css';
import { Button } from '@nextui-org/react';
import { NodeObject, NodeText } from './nodes';
import { INITIAL_STATE } from './INITIAL_STATE';

configure({ enforceActions: 'never' });

const state = observable.box<typeof INITIAL_STATE>(INITIAL_STATE);

const currentIndex = observable.box<number>(1);

const n = NodeObject({ children: { name: NodeText({}) } })({
  index: 1,
  onChange: v => state.set({ ...state.get(), ...v }),
  onStoreChange: v => state.set({ ...state.get(), ...v }),
  value: computed(() => state.get()),
  store: computed(() => state.get())
});

export const Vertical = () => {
  return (
    <div>
      <n.View />
    </div>
  );
};
