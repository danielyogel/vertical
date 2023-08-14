import React from 'react';
import { Observer, observer } from 'mobx-react-lite';
import { FC } from '../utils';
import { Node } from '../Interfaces';

type PreviusVM = Partial<Node<any, any>>;

export default function withNavigation<VM extends PreviusVM>(Renderer?: FC<VM>) {
  return function (obj: VM) {
    const Comp = Renderer ? observer(Renderer) : null;
    return {
      ...obj,
      Navigation: Comp
        ? () => (
            <Observer>
              {() => {
                return <Comp {...obj} />;
              }}
            </Observer>
          )
        : null
    };
  };
}
