import { reaction, toJS } from 'mobx';
import { observable } from 'mobx';
import './index.css';
import { INITIAL_STATE } from './INITIAL_STATE';
import { initialize } from './nodeTree';

export const state = observable.box<typeof INITIAL_STATE>(INITIAL_STATE);

reaction(
  () => state.get(),
  s => console.log(toJS(s)),
  { delay: 1000 }
);

const nodeTree = initialize(state);

export const Vertical = () => {
  return (
    <div className='w-full h-full'>
      <nodeTree.View />
    </div>
  );
};
