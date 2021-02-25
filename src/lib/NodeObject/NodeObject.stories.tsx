import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { observable, computed } from 'mobx';
import NodeObject from '.';
import { NodeScalar } from '..';
import { mapValues, pipe, toArray, map } from '../../utils';

const INITIAL_STATE = {
  name: 'John Doe' as string | null,
  phone: 9999999 as number | null
};

const NumberN = NodeScalar<number | null, typeof INITIAL_STATE, { label: string }>({
  Render: ({ value, onChange }) => {
    const v = value.get();
    return (
      <div>
        <div>
          <input type="number" value={!v ? '' : v} onChange={e => onChange(!e.target.value ? null : Number(e.target.value))} />;
        </div>
      </div>
    );
  }
});

const StringN = NodeScalar<string | null, typeof INITIAL_STATE, { label: string }>({
  Render: ({ value, onChange, label }) => {
    const v = value.get();
    return (
      <div>
        <div>
          <b>{label}</b>
        </div>
        <div>
          <input value={!v ? '' : v} onChange={e => onChange(e.target.value === null ? null : e.target.value)} />
        </div>
      </div>
    );
  }
});

const ObjectN = NodeObject<'name' | 'phone', typeof INITIAL_STATE, {}>({
  Render: vm => {
    return (
      <div>
        <div>{/* <b>isLoading: {String(isLoading)}</b> */}</div>
        <div
          style={{ padding: '10px' }}
          onClick={() => {
            vm.onStoreChange(mapValues(vm.store.get(), () => null));
          }}
        >
          ALL OBJECT STORE: {Object.values(vm.store.get()).join(' ')}
        </div>
        <div>
          {vm.children &&
            pipe(
              vm.children,
              toArray,
              map(([key, node]) => {
                return (
                  <div key={key} style={{ padding: '10px', margin: '10px', border: '1px solid black' }}>
                    <node.View />
                  </div>
                );
              })
            )}
        </div>
      </div>
    );
  }
});

const state = observable.box<typeof INITIAL_STATE>(INITIAL_STATE);

const node = ObjectN({
  children: {
    name: StringN({ label: 'Name' }),
    phone: NumberN({ label: 'Email', isVisible: ({ store }) => store.get().name !== 'daniel' })
  }
});

const vm = node({
  value: computed(() => state.get()),
  onChange: c => {
    state.set(c);
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
