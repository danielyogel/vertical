import React from 'react';
import { computed, IComputedValue, IObservableValue, observable } from 'mobx';
import { O } from 'ts-toolbelt';
import { FC, pipe } from '../../utils';
import { ParentParams } from '../NodeObject';
import { GetArrayVal } from '../GetVaueTypes';
import { Observer } from 'mobx-react-lite';
import { Params } from './Render';

export type Children = ReadonlyArray<(arg: ParentParams<any>) => any>;

type InitOptions = {
  Render: FC<Params>;
};

type Options<T extends Children> = {
  children: T;
  step?: IObservableValue<number>;
};

export default function NodeWizard(initOptions: InitOptions) {
  return function<T extends Children>(options: Options<T>) {
    const currentStep = options.step || observable.box(1);

    type ParentParams = {
      value: IComputedValue<O.MergeAll<{}, GetArrayVal<T>>>;
      onChange: (value: O.MergeAll<{}, GetArrayVal<T>>) => void;
      store: IComputedValue<any>;
      onStoreChange: (change: Partial<any>) => void;
    };

    return function(parentParams: ParentParams) {
      return pipe(parentParams, params => {
        const visibleChildren = computed(() => {
          return options.children
            .map(currChild => {
              return currChild({
                ...params,
                value: computed(() => params.value.get()) as any,
                onChange: o => params.onChange({ ...params.value.get(), ...o }),
                isParentDirty: computed(() => false),
                currentStep: computed(() => currentStep.get()),
                onStep: currentStep.set.bind(currentStep)
              });
            })
            .filter(vm => vm.isVisible?.get() !== false);
        });

        const isLoading = computed(() => Boolean(visibleChildren.get().find(child => child.isLoading.get())));

        const errors = computed(() => {
          return visibleChildren
            .get()
            .map(child => child.errors.get())
            .flat()
            .filter(Boolean);
        });

        return {
          children: options.children,
          isLoading,
          errors,
          View: () => {
            return (
              <Observer>
                {() => (
                  <initOptions.Render
                    visibleChildren={visibleChildren.get()}
                    currentStep={currentStep.get()}
                    onStep={currentStep.set.bind(currentStep)}
                    isLoading={isLoading.get()}
                    store={parentParams.store.get()}
                    onStoreChange={parentParams.onStoreChange}
                    errors={errors.get()}
                  />
                )}
              </Observer>
            );
          }
        };
      });
    };
  };
}
