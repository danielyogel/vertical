import React from 'react';
import { Observer, observer } from 'mobx-react-lite';
import { FC } from '../../utils';
import { BaseNode } from '../Interfaces';

export default function withView<VM extends Partial<BaseNode<any, any, any>>>(Renderer: FC<VM>) {
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
