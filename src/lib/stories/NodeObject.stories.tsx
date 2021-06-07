import React from 'react';
import { configure } from 'mobx';
import { Meta, Story } from '@storybook/react/types-6-0';
import { observable, computed } from 'mobx';
import { ArrayN, ObjectN, StringN, NumberN } from './renderedNodes';
import { observer } from 'mobx-react-lite';
import { BaseNodeNoView } from '../interfaces/BaseNode';

configure({ enforceActions: 'never' });

export const INITIAL_STATE = {
  name: 'John Doe' as string | null,
  lastName: '' as string | null,
  phone: 323223 as number | null,
  id: 2 as number | null,
  age: 324 as number | null,
  birthday: 23 as number | null,
  birthdayz: 23 as number | null
};

const state = observable.box<typeof INITIAL_STATE>(INITIAL_STATE);

const nodeaa = ArrayN({
  options: {},
  children: [
    ObjectN({
      options: { isNew: true },
      children: {
        name: StringN({ options: { label: 'Name' } }),
        lastName: StringN({ options: { label: 'lastName' }, isVisible: ({ store }) => store.get().age !== 3 }),
        phone: NumberN({ isVisible: ({ store }) => store.get().name !== 'daniel', options: { label: 'phone' } }),
        id: NumberN({ options: { label: 'id' } })
      }
    }),
    ObjectN({
      options: { isNew: true },
      children: {
        id: NumberN({ options: { label: 'id' } }),
        birthday: NumberN({ isVisible: ({ store }) => store.get().name !== 'daniel', options: { label: 'birthday' } }),
        age: (parent: BaseNodeNoView<number | null, {}, {}, {}>) => {
          return {
            ...parent,
            View: observer(() => {
              const v = parent.value.get();

              return (
                <div>
                  <div>age</div>
                  <input
                    style={{ color: 'red' }}
                    value={!v ? '' : v}
                    onChange={e => parent.onChange(e.target.value === null ? null : Number(e.target.value))}
                  />
                </div>
              );
            })
          };
        }
      }
    }),
    (parent: BaseNodeNoView<{ age: string }, any, any, any>) => {
      return {
        ...parent,
        // parentOptios: {},
        children: [] as any,
        View: () => (
          <div>
            <b>pp</b>
          </div>
        )
      };
    }
  ] as const
});

const vm = nodeaa({
  parentOptios: {},
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
