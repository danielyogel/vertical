import React from 'react';
import { configure, toJS } from 'mobx';
import { Meta, Story } from '@storybook/react/types-6-0';
import { observable, computed } from 'mobx';
import {
  ArrayN,
  ArrayChild,
  StringN,
  NumberN,
  OneOfN,
  ArrayChildLogical,
  ArrayChildViewOnly,
  ArrayMainN,
  List,
  ListItem,
  ListItemEdit
} from './storyRenderers';
import { flow } from '../utils';
import { withLoading, withMeta, withProgress, withView, withSelected, withErrors, withDisabled, withVisibility, withId } from '../lib/mixins';
import { INITIAL_STATE } from './INITIAL_STATE';
import { Button, InputNumber, Space } from 'antd';
import { LoaderOne } from './storyComponents';
import { pipe } from 'fp-ts/lib/function';

configure({ enforceActions: 'never' });

const state = observable.box<typeof INITIAL_STATE>(INITIAL_STATE);

const nodeaa = ArrayMainN({
  children: [
    () => {
      return { View: () => <div>daniel</div>, id: 'ssdsd' };
    },
    ArrayN({
      isSelected: vm => vm.progress.get() !== 33223 || vm.store.get().id === 21,
      children: [
        ArrayChildLogical({
          children: {
            one: ArrayChildViewOnly({
              isSelected: vm => vm.progress.get() !== 3233,
              errors: vm => vm.store.get().name === 'foo' && [{ message: 'foo' }],
              children: {
                name: StringN({
                  label: null,
                  errors: vm => vm.value.get() === 'wrong' && [{ message: 'asd' }],
                  isSelected: vm => vm.value.get() !== 'ad'
                }),
                lastName: StringN({ isVisible: ({ store }) => store.get().age !== 3 }),
                phone: NumberN({ label: 'Phone Custom Title', isVisible: ({ store }) => store.get().name !== 'daniel' }),
                id: NumberN({ isDisabled: vm => vm.store.get().age === 3 }),
                gender: OneOfN({ items: (['male', 'female', null] as const).map(k => ({ key: k, title: k })) }),
                locations: List({
                  child: ListItem({
                    children: {
                      province: StringN(),
                      postalCode: NumberN()
                    }
                  }),
                  childEdit: ListItemEdit({
                    children: {
                      postalCode: NumberN()
                    }
                  }),
                  defaultValue: { province: '', postalCode: null, isCapital: 'yes' }
                })
              }
            }),
            two: ArrayChildViewOnly({
              isSelected: vm => vm.progress.get() !== 3233,
              errors: vm => vm.store.get().name === 'bar' && [{ message: 'bar' }],
              children: {
                name: StringN({ errors: vm => vm.value.get() === 'wrong' && [{ message: 'asd' }], isSelected: vm => vm.value.get() !== 'ad' }),
                lastName: StringN({ isVisible: ({ store }) => store.get().age !== 3 }),
                phone: NumberN({ label: 'Phone Custom Title', isVisible: ({ store }) => store.get().name !== 'daniel' }),
                id: NumberN({ isDisabled: vm => vm.store.get().age === 3 }),
                gender: OneOfN({ items: (['male', 'female', null] as const).map(k => ({ key: k, title: k })) })
              }
            })
          }
        }),
        ArrayChild({
          children: {
            id: NumberN({}),
            birthday: NumberN({ isVisible: ({ store }) => store.get().name !== 'daniel' }),
            age: flow(
              withId(),
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
            country: params => {
              return { ...params, View: () => <div>~~ Node Custom view ~~</div>, id: 'asdsd2323Afdfpr' };
            }
          }
        }),
        vm => {
          const isLoading = computed(() => false);
          const isDisabled = computed(() => false);
          return {
            ...vm,
            isLoading,
            isDisabled,
            id: 'sdsdrtZZZZA',
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
        flow(vm => {
          return pipe(
            { ...vm, children: null, isDisabled: computed(() => false) },
            withLoading(),
            withId(),
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
    })
  ]
});

const vm = nodeaa({
  value: computed(() => state.get()),
  onChange: c => state.set({ ...state.get(), ...c }),
  store: computed(() => state.get()),
  onStoreChange: change => state.set({ ...state.get(), ...change }),
  index: 0
});

state.observe_(p => {
  console.log(toJS(p.object.get().locations));
});

export default {
  title: 'Vertical',
  component: vm.View
} as Meta;

const Template: Story<{}> = args => <vm.View {...args} />;

export const Vertical = Template.bind({});
