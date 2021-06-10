import React from 'react';
import { configure } from 'mobx';
import { Meta, Story } from '@storybook/react/types-6-0';
import { observable, computed } from 'mobx';
import { ArrayN, ObjectN, StringN, NumberN } from './NodeArrayStoriesRenderers';
import { BaseNode } from '../lib/Interfaces';
import { flow } from '../utils';
import { withParent, withView } from '../lib/mixins';
import { INITIAL_STATE } from './INITIAL_STATE';

configure({ enforceActions: 'never' });

const state = observable.box<typeof INITIAL_STATE>(INITIAL_STATE);

const nodeaa = ArrayN({
  options: {},
  children: [
    ObjectN({
      options: { bla: 'a' },
      children: {
        name: StringN({ options: { label: 'Name' } }),
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
              <div>
                <div>age</div>
                <input
                  style={{ color: 'red' }}
                  value={!v ? '' : v}
                  onChange={e => vm.onChange(e.target.value === null ? null : Number(e.target.value))}
                />
              </div>
            );
          })
        ),
        country: parent => {
          return { ...parent, View: () => <div>country</div> };
        }
      }
    }),
    (parent: Pick<BaseNode<{ age: number | null }, any, any>, 'onChange' | 'value'>) => {
      return {
        View: () => (
          <div>
            <p>{parent.value.get().age}</p>
            <button onClick={() => parent.onChange({ age: (parent.value.get().age || 1) + 1 })}>
              <b>plus one to age</b>
            </button>
          </div>
        )
      };
    },
    flow(
      withParent<{ age: number | null }, typeof INITIAL_STATE>(),
      withView(parent => (
        <div>
          <p>{parent.value.get().age}</p>
          <button onClick={() => parent.onChange({ age: (parent.value.get().age || 1) - 1 })}>
            <b>minus one to age</b>
          </button>
        </div>
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
