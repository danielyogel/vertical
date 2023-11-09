import { reaction, toJS } from 'mobx';
import './index.css';
import { state } from './INITIAL_STATE';
import { initialize } from './nodeTree';

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
