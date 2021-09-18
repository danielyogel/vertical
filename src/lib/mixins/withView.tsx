import React from 'react';
import { Observer, observer } from 'mobx-react-lite';
import { FC } from '../../utils';
import { Node } from '../Interfaces';

type PreviusVM = Partial<Node<any, any, any>>;

export default function withView<VM extends PreviusVM>(Renderer: FC<VM>) {
  return function (obj: VM) {
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
