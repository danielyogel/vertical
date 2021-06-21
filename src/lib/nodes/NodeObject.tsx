import { computed } from 'mobx';
import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow, map, pipe, keys } from '../../utils';
import { BaseNode, InferObjectValue } from '../Interfaces';
import { withLoading, withParent, withProgress, withSelected, withVisibility, withView, withDisabled, withErrors, withMeta } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as DisabledParams } from '../mixins/withDisabled';
import { Params as ErrorParams } from '../mixins/withErrors';
import { Params as MetaParams } from '../mixins/withMeta';

type ChildrenKeys = 'onChange' | 'onStoreChange' | 'store' | 'value';

type Child<S> = O.Required<Partial<BaseNode<any, S>>, 'View'>;

type VM<V, S> = BaseNode<V, S> & { children: Record<string, Child<S>> };

type Children<keys extends string, S> = Record<keys, (parent: Pick<VM<any, S>, ChildrenKeys> & { index: string }) => Child<S>>;

type Renderer<S> = FC<Except<VM<any, S>, 'View'>>;

export default function<S>(params: { Render: Renderer<S> }) {
  return function<T extends Children<string, S>>(
    options: SelectedParams<any, S> & VisibilityParams<any, S> & DisabledParams<any, S> & ErrorParams<any, S> & { children: T } & MetaParams
  ) {
    return flow(withParent<InferObjectValue<T>, S>(), vm => {
      return pipe(
        vm,
        vm => ({
          ...vm,
          index: null,
          children: pipe(
            keys(options.children),
            map(key => {
              const instance = options.children[key]({
                ...vm,
                value: computed(() => vm.value.get()[key]) as any,
                onChange: val => vm.onChange({ ...vm.value.get(), [key]: val }) as any,
                index: key
              });

              return [key, instance];
            }),
            Object.fromEntries
          )
        }),
        withLoading(),
        withMeta(options),
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
