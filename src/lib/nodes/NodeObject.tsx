import { computed } from 'mobx';
import { Except, SetRequired } from 'type-fest';
import { FC, flow, map, pipe } from '../../utils';
import { BaseNode, InferObjectValue } from '../Interfaces';
import { withLoading, withOptions, withParent, withProgress, withSelected, withVisibility, withView, withDisabled, withErrors } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as OptionsParams } from '../mixins/withOptions';
import { Params as DisabledParams } from '../mixins/withDisabled';
import { Params as ErrorParams } from '../mixins/withErrors';

type ChildrenKeys = 'onChange' | 'onStoreChange' | 'options' | 'store' | 'value';

type Child<S> = SetRequired<Partial<BaseNode<any, S, any>>, 'View'>;

type VM<V, S, O> = BaseNode<V, S, O> & { children: Record<string, Child<S>> };

type Children<keys extends string, S, O> = Record<keys, (parent: Pick<VM<any, S, O>, ChildrenKeys>) => Child<S>>;

type Renderer<S, O> = FC<Except<VM<any, S, O>, 'View'>>;

export default function<S, O>(params: { Render: Renderer<S, O> }) {
  return function<T extends Children<string, S, O>>(
    options: OptionsParams<O> & SelectedParams<S> & VisibilityParams<S> & DisabledParams<any, S, O> & ErrorParams<any, S, O> & { children: T }
  ) {
    return flow(withParent<InferObjectValue<T>, S>(), vm => {
      return pipe(
        vm,
        withOptions(options),
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
        withLoading(),
        withProgress(),
        withSelected(options),
        withErrors(options),
        withDisabled(options),
        withVisibility(options),
        withView(params.Render)
      );
    });
  };
}
