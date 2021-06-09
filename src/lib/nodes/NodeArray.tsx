import React from 'react';
import { IObservableValue, observable } from 'mobx';
import { Except, SetRequired } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow } from '../../utils';
import { BaseNode } from '../interfaces/BaseNode';
import { GetArrayVal } from '../interfaces/GetVaueTypes';
import { withLoading, withOptions, withParent, withProgress, withSelected, withVisibility } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as OptionsParams } from '../mixins/withOptions';
import { Observer, observer } from 'mobx-react-lite';

type Child = SetRequired<Partial<BaseNode<any, any, any, any>>, 'View'>;

type VM<S, O> = BaseNode<any, S, O, any> & { currentIndex: IObservableValue<number>; children: Array<Child> };

type Children<S, O> = ReadonlyArray<(parent: Except<VM<S, O>, 'View' | 'children'>) => Child>;

type Renderer<S, O> = FC<Except<VM<S, O>, 'View'>>;

export default function<S, O>(params: { Render: Renderer<S, O> }) {
  return function<C extends Children<S, O>>(options: OptionsParams<O> & SelectedParams<S> & VisibilityParams<S> & { children: C }) {
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
              currentIndex,
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
