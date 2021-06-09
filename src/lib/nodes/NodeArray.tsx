import { IObservableValue, observable } from 'mobx';
import { Except, SetRequired } from 'type-fest';
import { O } from 'ts-toolbelt';
import { FC, flow } from '../../utils';
import { BaseNode, InferArrayValue } from '../Interfaces';
import { withLoading, withOptions, withParent, withProgress, withSelected, withVisibility, withView } from '../mixins';
import { Params as SelectedParams } from '../mixins/withSelected';
import { Params as VisibilityParams } from '../mixins/withVisibility';
import { Params as OptionsParams } from '../mixins/withOptions';

type Child = SetRequired<Partial<BaseNode<any, any, any>>, 'View'>;

type VM<S, O> = BaseNode<any, S, O> & { currentIndex: IObservableValue<number>; children: Array<Child> };

type Children<S, O> = ReadonlyArray<(parent: Except<VM<S, O>, 'View' | 'children'>) => Child>;

type Renderer<S, O> = FC<Except<VM<S, O>, 'View'>>;

export default function<S, O>(params: { Render: Renderer<S, O> }) {
  return function<C extends Children<S, O>>(options: OptionsParams<O> & SelectedParams<S> & VisibilityParams<S> & { children: C }) {
    return flow(
      withParent<O.MergeAll<{}, InferArrayValue<C>>, S>(),
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
          children: [...options.children].map(node => node({ ...vm, currentIndex }))
        };
      },
      withView(params.Render)
    );
  };
}
