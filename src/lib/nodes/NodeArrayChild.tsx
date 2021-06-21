import { computed } from 'mobx';
import { Except } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow, map, pipe, keys } from '../../utils';
import { BaseNode, InferObjectValue } from '../Interfaces';
import { withLoading, withParent, withProgress, withSelected, withVisibility, withView, withDisabled, withErrors, withMeta } from '../mixins';
import { isSelected as isSelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { isDisabled as isDisabledParams } from '../mixins/withDisabled';
import { errors as errorsParams } from '../mixins/withErrors';
import { Params as MetaParams } from '../mixins/withMeta';
import { Special } from './NodeArray';

type ChildrenKeys = 'onChange' | 'onStoreChange' | 'store' | 'value';

type Child<S> = O.Required<Partial<BaseNode<any, S>>, 'View'>;

type VM<V, S> = BaseNode<V, S> & { children: Record<string, Child<S>> } & Special;

type Children<keys extends string, S> = Record<keys, (parent: Pick<VM<any, S>, ChildrenKeys> & { index: string }) => Child<S>>;

type Renderer<S> = FC<Except<VM<any, S>, 'View'>>;

export default function<S>(params: { Render: Renderer<S> }) {
  type Options<T extends Children<string, S>> = {
    isSelected?: isSelectedParams<any, S, Except<VM<any, S>, 'View' | 'isVisible' | 'errors' | 'isSelected' | 'isDisabled'>>;
    errors?: errorsParams<any, S, Except<VM<any, S>, 'View' | 'isVisible' | 'errors' | 'isDisabled'>>;
    isDisabled?: isDisabledParams<any, S, Except<VM<any, S>, 'View' | 'isVisible' | 'isDisabled'>>;
  } & VisibilityParams<any, S> & {
      children: T;
    } & MetaParams;

  return function<T extends Children<string, S>>(options: Options<T>) {
    return flow(withParent<InferObjectValue<T>, S, Special>(), vm => {
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

              return [key, instance] as const;
            }),
            e => Object.fromEntries(e)
          )
        }),
        withLoading(),
        withMeta(options),
        withProgress(),
        withSelected(options.isSelected),
        withErrors(options.errors),
        withDisabled(options.isDisabled),
        withVisibility(options),
        withView(params.Render)
      );
    });
  };
}
