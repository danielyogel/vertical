import React from 'react';
import { Observer, observer } from 'mobx-react-lite';
import { FC } from '../../utils';
import { ArrayBaseNodeNoView } from '../interfaces/BaseNode';

export default function withViewArray<VM extends ArrayBaseNodeNoView<any, any, any>>(Renderer: FC<VM>) {
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
