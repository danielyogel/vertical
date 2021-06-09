import { computed } from 'mobx';
import { Except, SetRequired } from 'type-fest';
import { FC, flow, map, pipe } from '../../utils';
import { BaseNode, InferObjectValue } from '../Interfaces';
import { withLoading, withOptions, withParent, withProgress, withSelected, withVisibility, withView } from '../mixins';
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
        const keys = Object.keys(options.children) as Array<keyof typeof options.children>;
        const children = pipe(
          keys,
          map(key => {
            const instance = options.children[key]({
              ...vm,
              value: computed(() => vm.value.get()[key]) as any,
              onChange: val => vm.onChange({ ...vm.value.get(), [key]: val }) as any
            });

            return [key, instance];
          }),
          Object.fromEntries
        );
        return { ...vm, children };
      },
      withView(params.Render)
    );
  };
}
