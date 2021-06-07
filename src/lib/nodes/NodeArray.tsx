import { observable } from 'mobx';
import { O } from 'ts-toolbelt';
import { FC, flow } from '../../utils';
import { BaseNodeNoView, NodeObjectFn, ArrayBaseNodeNoView } from '../interfaces/BaseNode';
import { GetArrayVal } from '../interfaces/GetVaueTypes';
import { withLoading, withOptions, withParent, withProgress, withSelected, withVisibility } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as OptionsParams } from '../mixins/withOptions';
import { Observer, observer } from 'mobx-react-lite';
import React from 'react';

export default function<S, O>(params: { Render: FC<ArrayBaseNodeNoView<any, S, O>> }) {
  return function<C extends ReadonlyArray<NodeObjectFn<BaseNodeNoView<any, S, O>>>>(
    options: OptionsParams<O> & SelectedParams<S> & VisibilityParams<S> & { children: C }
  ) {
    return flow(
      withParent<O.MergeAll<{}, GetArrayVal<C>>, S>(),
      withOptions(options),
      withLoading(),
      withProgress(),
      withSelected(options),
      withVisibility(options),
      vm => {
        const currentIndex = observable.box(1);
        return {
          ...vm,
          currentIndex,
          children: [...options.children].map(node => {
            return node({
              ...vm,
              parentOptios: options.options
            });
          })
        };
      },
      vm => {
        const Comp = observer(params.Render);
        return {
          ...vm,
          View: () => (
            <Observer>
              {() => {
                if (vm?.isSelected?.get() === false || vm?.isVisible?.get() === false) {
                  return null;
                }

                return <Comp {...vm} />;
              }}
            </Observer>
          )
        };
      }
    );
  };
}
