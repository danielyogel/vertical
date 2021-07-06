import React from 'react';
import { configure, IComputedValue, IObservableValue } from 'mobx';
import { Meta, Story } from '@storybook/react/types-6-0';
import { observable, computed } from 'mobx';
import { ArrayN, ArrayChild, StringN, NumberN, OneOfN } from './storyRenderers';
import { BaseNode } from '../lib/Interfaces';
import { flow } from '../utils';
import { withLoading, withMeta, withParent, withProgress, withView, withSelected, withErrors, withDisabled, withVisibility } from '../lib/mixins';
import { INITIAL_STATE } from './INITIAL_STATE';
import { Button, InputNumber, Space } from 'antd';
import { ArrayProps } from '../lib/nodes/NodeArray';
import { LoaderOne } from './storyComponents';
import { pipe } from 'fp-ts/lib/function';

configure({ enforceActions: 'never' });

const state = observable.box<typeof INITIAL_STATE>(INITIAL_STATE);

const nodeaa = ArrayN({
  isSelected: vm => vm.progress.get() !== 33223 || vm.store.get().id === 21,
  children: [
    ArrayChild({
      isSelected: vm => vm.progress.get() !== 3233,
      children: {
        name: StringN({ errors: vm => vm.value.get() === 'wrong' && [{ message: 'asd' }], isSelected: vm => vm.value.get() !== 'ad' }),
        lastName: StringN({ isVisible: ({ store }) => store.get().age !== 3 }),
        phone: NumberN({ label: 'Phone Custom Title', isVisible: ({ store }) => store.get().name !== 'daniel' }),
        id: NumberN({ isDisabled: vm => vm.store.get().age === 3 }),
        gender: OneOfN({ items: (['male', 'female', null] as const).map(k => ({ key: k, title: k })) })
      }
    }),
    ArrayChild({
      children: {
        id: NumberN({}),
        birthday: NumberN({ isVisible: ({ store }) => store.get().name !== 'daniel' }),
        age: flow(
          withParent<number | null, typeof INITIAL_STATE>(),
          withView(vm => {
            const v = vm.value.get();

            return (
              <div>
                <b>Age Custom Node</b>
                <InputNumber value={!v ? '' : v} onChange={v => vm.onChange(!v ? null : v)} />
              </div>
            );
          })
        ),
        country: parent => {
          return { ...parent, View: () => <div>~~ Node Custom view ~~</div> };
        }
      }
    }),
    (
      vm: Pick<BaseNode<{ age: number | null }, any>, 'onChange' | 'value'> & {
        currentIndex: IObservableValue<number>;
        isFirst: IComputedValue<boolean>;
        isLast: IComputedValue<boolean>;
        back: () => void;
        next: () => void;
      }
    ) => {
      const isLoading = computed(() => false);
      const isDisabled = computed(() => false);
      return {
        ...vm,
        isLoading,
        isDisabled,
        View: () => (
          <Space direction="vertical">
            <b>Object Custom Node</b>

            <Button onClick={() => vm.onChange({ age: (vm.value.get().age || 1) + 1 })}>
              <b>plus one to age</b>
            </Button>
            <div>
              <b>Age: </b> <span>{vm.value.get().age}</span>
            </div>

            <Space>
              {!vm.isFirst.get() && (
                <Button onClick={vm.back} disabled={isDisabled.get()}>
                  Back
                </Button>
              )}
              {!vm.isLast.get() && (
                <Button onClick={vm.next} disabled={isDisabled.get()}>
                  Next
                </Button>
              )}
              {isLoading.get() && (
                <div>
                  <LoaderOne />
                  <span className="ml-3 text-green-600">Loading...</span>
                </div>
              )}
            </Space>
          </Space>
        )
      };
    },
    flow(withParent<{ age: number | null }, typeof INITIAL_STATE, ArrayProps>(), vm => {
      return pipe(
        { ...vm, children: null, isDisabled: computed(() => false), index: null },
        withLoading(),
        withMeta({}),
        withProgress(),
        withSelected(({ value }) => value.get().age !== 232323),
        withErrors(({ value }) => [{ message: String(value.get().age) }]),
        withDisabled(vm => vm.value.get().age === 310),
        withVisibility(vm => vm.progress.get() !== 4),
        withView(vm => (
          <Space direction="vertical">
            <b>Object Custom Node Using Mixins</b>

            <Button onClick={() => vm.onChange({ age: (vm.value.get().age || 1) - 1 })}>
              <b>minus one to age</b>
            </Button>
            <div>
              <b>Age: </b> <span>{vm.value.get().age}</span>
            </div>

            <Space>
              {!vm.isFirst.get() && (
                <Button onClick={vm.back} disabled={vm.isDisabled.get()}>
                  Back
                </Button>
              )}
              {!vm.isLast.get() && (
                <Button onClick={vm.next} disabled={vm.isDisabled.get()}>
                  Next
                </Button>
              )}
              {vm.isLoading.get() && (
                <div>
                  <LoaderOne />
                  <span className="ml-3 text-green-600">Loading...</span>
                </div>
              )}
            </Space>
          </Space>
        ))
      );
    })
  ] as const
});

const vm = nodeaa({
  value: computed(() => state.get()),
  onChange: c => state.set({ ...state.get(), ...c }),
  store: computed(() => state.get()),
  onStoreChange: change => state.set({ ...state.get(), ...change })
});

export default {
  title: 'NodeObject',
  component: vm.View
} as Meta;

const Template: Story<{}> = args => <vm.View {...args} />;

export const FirstStory = Template.bind({});
