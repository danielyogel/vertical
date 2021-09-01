import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { observable, configure, computed } from 'mobx';
import { Observer } from 'mobx-react-lite';

configure({ enforceActions: 'never' });

const PERSONS = [{ name: 'daniel' }, { name: 'moshe' }];

const createPersonVM = (name: string) => {
  const _name = observable.box(name);
  const addName = () => {
    _name.set(_name.get() + ' more ');
  };
  return {
    name: _name,
    addName,
    View: () => (
      <Observer>
        {() => {
          return (
            <div>
              <div>name is: {_name.get()}</div>
              <div>
                <button onClick={addName}>add</button>
              </div>
            </div>
          );
        }}
      </Observer>
    )
  };
};

const vms = observable.box(PERSONS.map(p => createPersonVM(p.name)));

const allNames = computed(() => {
  return vms.get().map(vm => vm.name.get());
});

function View() {
  return (
    <div>
      <div>
        <b>VMs:</b>
      </div>
      <div>
        <Observer>
          {() => {
            return (
              <div>
                {vms.get().map((vm, index) => {
                  return <vm.View key={index} />;
                })}
                <div>
                  All names:{' '}
                  {allNames.get().map(n => (
                    <div key={n} style={{ border: '1px solid red' }}>
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            );
          }}
        </Observer>
      </div>
      <div>
        <button
          onClick={() => {
            vms.set([...vms.get(), createPersonVM(Math.random().toString().slice(0, 5))]);
          }}
        >
          add a new VM
        </button>
        <button
          onClick={() => {
            vms.set([...vms.get().slice(1, 100)]);
          }}
        >
          remove first vm
        </button>
      </div>
    </div>
  );
}

export default {
  title: 'DynamicArrayPOC',
  component: View
} as Meta;

const Template: Story<{}> = args => <View {...args} />;

export const FirstStory = Template.bind({});
