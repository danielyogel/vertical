import { configure } from 'mobx';
import { observable } from 'mobx';

import { INITIAL_STATE } from './INITIAL_STATE';

configure({ enforceActions: 'never' });

const state = observable.box<typeof INITIAL_STATE>(INITIAL_STATE);

const currentIndex = observable.box(1);

export const Vertical = () => {
  return <div>story</div>;
};
