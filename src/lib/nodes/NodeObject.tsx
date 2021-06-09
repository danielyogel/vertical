import React from 'react';
import { computed } from 'mobx';
import { Except, SetRequired } from 'type-fest';
import { Observer, observer } from 'mobx-react-lite';
import { FC, flow, map, pipe } from '../../utils';
import { BaseNode, InferObjectValue } from '../Interfaces';
import { withLoading, withOptions, withParent, withProgress, withSelected, withVisibility } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as OptionsParams } from '../mixins/withOptions';

type Child<S> = SetRequired<Partial<BaseNode<any, S, any>>, 'View'>;

type VM<V, S, O, K extends string> = BaseNode<V, S, O> & { children: Record<K, Child<S>> };

type Children<keys extends string, S, O> = Record<keys, (parent: Except<VM<any, S, O, any>, 'View' | 'children'>) => Child<S>>;

type Renderer<K extends string, S, O> = FC<Except<VM<any, S, O, K>, 'View'>>;

export default function<K extends string, S, O>(params: { Render: Renderer<K, S, O> }) {
  return function<Keys extends K>(options: OptionsParams<O> & SelectedParams<S> & VisibilityParams<S> & { children: Children<Keys, S, O> }) {
    return flow(
      withParent<InferObjectValue<typeof options.children>, S>(),
      withOptions(options),
      withLoading(),
      withProgress(),
      withSelected(options),
      withVisibility(options),
      vm => {
        const children = pipe(
          options.children,
          Object.keys,
          map(key => {
            const k = key as keyof typeof options.children;
            const instance = options.children[k]({
              ...vm,
              value: computed(() => vm.value.get()[k]) as any,
              onChange: val => vm.onChange({ ...vm.value.get(), [key]: val }) as any
            });

            return [key, instance];
          }),
          entries => Object.fromEntries(entries)
        );
        return { ...vm, children };
      },
      obj => {
        const Comp = observer(params.Render);
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
      }
    );
  };
}
