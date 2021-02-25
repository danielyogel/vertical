import React from 'react';
import { Observer, observer } from 'mobx-react-lite';
import { FC } from '../../utils';
import { RecordBaseNode } from '../BaseNode';

export default function withViewRecord<VM extends Partial<RecordBaseNode<any, any, any, any>>>(Renderer: FC<VM>) {
  return function(obj: VM) {
    const Comp = observer(Renderer);
    return {
      ...obj,
      View: () => (
        <Observer>
          {() => {
            if (obj?.isSelected?.get() === false || obj?.isVisible?.get() === false) {
              return null;
            }

            return <Comp {...obj} />;
          }}
        </Observer>
      )
    };
  };
}
