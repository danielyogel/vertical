import React from 'react';
import NodeObject from '../lib/nodes/NodeObject';
import { NodeScalar } from '../lib';
import { mapValues, pipe, mapWithIndexArr } from '../utils';
import NodeArray from '../lib/nodes/NodeArray';
import { INITIAL_STATE } from './NodeArray.stories';

export const NumberN = NodeScalar<number | null, typeof INITIAL_STATE, { label: string }>({
  Render: ({ value, onChange, setLoading, isLoading, options: { label } }) => {
    const v = value.get();
    return (
      <div>
        <div>{String(label)}</div>
        <b
          onClick={() => {
            setLoading(!isLoading.get());
          }}
        >
          Toggle Loading - {String(isLoading.get())}
        </b>
        <div>
          <input type="number" value={!v ? '' : v} onChange={e => onChange(!e.target.value ? null : Number(e.target.value))} />
        </div>
      </div>
    );
  }
});

export const StringN = NodeScalar<string | null, typeof INITIAL_STATE, { label: string }>({
  Render: ({ value, onChange, options: { label } }) => {
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

export const ObjectN = NodeObject<keyof typeof INITIAL_STATE, typeof INITIAL_STATE, { bla: string }>({
  Render: vm => {
    return (
      <div className="bg-red">
        <div>is object loading: {String(vm.isLoading.get())}</div>
        <div
          className="p-10"
          onClick={() => {
            vm.onStoreChange(mapValues(vm.store.get(), () => null));
          }}
        >
          <b className="cursor-pointer">Clear All</b>
        </div>
        <div>
          <div>Inner options: {vm.options.bla}</div>
          {Object.entries(vm.children).map(([key, node]) => {
            return (
              <div className="text-red border border-red-600 p-10 m-10" key={key}>
                <node.View />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
});

export const ArrayN = NodeArray<typeof INITIAL_STATE, {}>({
  Render: vm => {
    return (
      <div>
        <div>is array loading: {String(vm.isLoading.get())}</div>

        <div
          className="p-10"
          onClick={() => {
            vm.onStoreChange(mapValues(vm.store.get(), () => null));
          }}
        >
          ALL OBJECT STORE: {Object.values(vm.store.get()).join(' ')}
        </div>
        <div>
          {pipe(
            [...vm.children],
            mapWithIndexArr((indwx, node) => {
              return vm.currentIndex.get() === indwx + 1 && <node.View key={indwx} />;
            })
          )}
        </div>
        <div>
          <button onClick={() => vm.currentIndex.set(vm.currentIndex.get() - 1)}>Back</button>
          <button onClick={() => vm.currentIndex.set(vm.currentIndex.get() + 1)}>Next</button>
        </div>
      </div>
    );
  }
});
