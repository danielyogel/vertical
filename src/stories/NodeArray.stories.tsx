import React from 'react';
import { configure } from 'mobx';
import { Meta, Story } from '@storybook/react/types-6-0';
import { observable, computed } from 'mobx';
import { ArrayN, ObjectN, StringN, NumberN } from './NodeArrayStoriesRenderers';
import { BaseNode } from '../lib/Interfaces';
import { flow } from '../utils';
import { withParent, withView } from '../lib/mixins';
import { INITIAL_STATE } from './INITIAL_STATE';
import { Button, InputNumber, Space } from 'antd';

configure({ enforceActions: 'never' });

const state = observable.box<typeof INITIAL_STATE>(INITIAL_STATE);

const nodeaa = ArrayN({
  options: {},
  children: [
    ObjectN({
      options: { bla: 'a' },
      children: {
        name: StringN({ options: { label: 'Name' }, errrors: vm => vm.value.get() === 'wrong' && [{ message: 'asd' }] }),
        lastName: StringN({ options: { label: 'lastName' }, isVisible: ({ store }) => store.get().age !== 3 }),
        phone: NumberN({ isVisible: ({ store }) => store.get().name !== 'daniel', options: { label: 'phone' } }),
        id: NumberN({ options: { label: 'id' } })
      }
    }),
    ObjectN({
      options: { bla: 'a' },
      children: {
        id: NumberN({ options: { label: 'id' } }),
        birthday: NumberN({ isVisible: ({ store }) => store.get().name !== 'daniel', options: { label: 'birthday' } }),
        age: flow(
          withParent<number | null, typeof INITIAL_STATE>(),
          withView(vm => {
            const v = vm.value.get();

            return (
              <div className="bg-yellow-400">
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
    (params: Pick<BaseNode<{ age: number | null }, any, any>, 'onChange' | 'value'>) => {
      return {
        View: () => (
          <Space direction="vertical">
            <b>Object Custom Node</b>

            <Button onClick={() => params.onChange({ age: (params.value.get().age || 1) + 1 })}>
              <b>plus one to age</b>
            </Button>
            <div>
              <b>Age: </b> <span>{params.value.get().age}</span>
            </div>
          </Space>
        )
      };
    },
    flow(
      withParent<{ age: number | null }, typeof INITIAL_STATE>(),
      withView(vm => (
        <Space direction="vertical">
          <b>Object Custom Node Using Mixins</b>

          <Button onClick={() => vm.onChange({ age: (vm.value.get().age || 1) - 1 })}>
            <b>minus one to age</b>
          </Button>
          <div>
            <b>Age: </b> <span>{vm.value.get().age}</span>
          </div>
        </Space>
      ))
    )
  ] as const
});

const vm = nodeaa({
  value: computed(() => state.get()),
  onChange: c => {
    state.set({ ...state.get(), ...c });
  },
  store: computed(() => {
    return state.get();
  }),
  onStoreChange: change => {
    state.set({ ...state.get(), ...change });
  }
});

export default {
  title: 'NodeObject',
  component: vm.View
} as Meta;

const Template: Story<{}> = args => <vm.View {...args} />;

export const FirstStory = Template.bind({});
