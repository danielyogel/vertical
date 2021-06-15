import React from 'react';
import NodeObject from '../lib/nodes/NodeObject';
import { NodeScalar } from '../lib';
import { Divider } from 'antd';
import { Button, InputNumber, Space, Input, Radio } from 'antd';
import { mapValues, pipe, mapWithIndexArr } from '../utils';
import NodeArray from '../lib/nodes/NodeArray';
import NodeOneOf from '../lib/nodes/NodeOneOf';
import classnames from 'classnames';
import { INITIAL_STATE } from './INITIAL_STATE';
import { LoaderOne, LoaderTwo } from './StorybookComponents';

export const NumberN = NodeScalar<number | null, typeof INITIAL_STATE, { label: string }>({
  Render: ({ value, onChange, setLoading, isLoading, options: { label } }) => {
    const v = value.get();
    const toggleLoading = () => setLoading(!isLoading.get());

    return (
      <Space>
        <b className="inline-block capitalize w-16 pr-1">{String(label)}</b>
        <InputNumber value={!v ? undefined : v} onChange={e => onChange(!e.valueOf() ? null : Number(e.valueOf()))} />
        <Button type="primary" onClick={toggleLoading}>
          <div className="flex justify-center items-center">
            <span className="mr-1">{isLoading.get() ? 'Cancel' : 'Submit'}</span>
            {isLoading.get() && <LoaderTwo />}
          </div>
        </Button>
      </Space>
    );
  }
});

export const StringN = NodeScalar<string | null, typeof INITIAL_STATE, { label: string }>({
  Render: ({ value, onChange, setLoading, isLoading, errors, options: { label } }) => {
    const v = value.get();
    const toggleLoading = () => setLoading(!isLoading.get());

    return (
      <Space>
        <b className="inline-block capitalize w-16 pr-1">{String(label)}</b>

        <div>
          <Input value={!v ? '' : v} onChange={e => onChange(e.target.value)} />
        </div>

        <Button type="primary" onClick={toggleLoading} disabled={!!errors.get().length}>
          <div className="flex justify-center items-center">
            <span className="mr-1">{isLoading.get() ? 'Cancel' : 'Submit'}</span>
            {isLoading.get() && <LoaderTwo />}
          </div>
        </Button>
      </Space>
    );
  }
});

export const OneOfN = NodeOneOf<typeof INITIAL_STATE, { label: string }>({
  Render: ({ value, onChange, setLoading, isLoading, errors, items, options: { label } }) => {
    const toggleLoading = () => setLoading(!isLoading.get());

    return (
      <Space>
        <b className="inline-block capitalize w-16 pr-1">{String(label)}</b>

        <div>
          <Radio.Group onChange={e => onChange(e.target.value)} value={value.get()}>
            {items
              .filter(i => i.key !== null)
              .map(i => (
                <Radio key={i.key} value={i.key}>
                  {i?.label ?? i.key}
                </Radio>
              ))}
          </Radio.Group>
        </div>

        <Button type="primary" onClick={toggleLoading} disabled={!!errors.get().length}>
          <div className="flex justify-center items-center">
            <span className="mr-1">{isLoading.get() ? 'Cancel' : 'Submit'}</span>
            {isLoading.get() && <LoaderTwo />}
          </div>
        </Button>
      </Space>
    );
  }
});

export const ObjectN = NodeObject<typeof INITIAL_STATE, { bla: string }>({
  Render: ({ children, isLoading }) => {
    return (
      <Space direction="vertical" className={classnames('border border-gray-400 rounded p-4', { 'bg-red-400': false })}>
        <div>
          {isLoading.get() && (
            <>
              <LoaderOne />
              <span className="ml-3 text-green-600">Loading...</span>
            </>
          )}
        </div>
        <Space direction="vertical">
          {Object.entries(children).map(([key, node]) => {
            return <node.View key={key} />;
          })}
        </Space>
      </Space>
    );
  }
});

export const ArrayN = NodeArray<typeof INITIAL_STATE, {}>({
  Render: vm => {
    return (
      <Space direction="vertical">
        <Space>
          {pipe(
            [...vm.children],
            mapWithIndexArr((indwx, node) => vm.currentIndex.get() === indwx + 1 && <node.View key={indwx} />)
          )}
        </Space>

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

        <Divider />

        <Space direction="vertical">
          <div>
            <b className="text-green-600">isLoading:</b> <span> {String(vm.isLoading.get())}</span>
            <b className="text-green-600">isDisabled:</b> <span> {String(vm.isDisabled.get())}</span>
            <b className="text-green-600">errors:</b> <span> {JSON.stringify(vm.errors.get())}</span>
          </div>

          <Divider />

          <ul>
            {Object.entries(vm.store.get()).map(([k, v]) => {
              return (
                <li key={k}>
                  <Space>
                    <b>{k}</b>
                    <span>{v}</span>
                  </Space>
                </li>
              );
            })}
          </ul>
          <Button type="primary" disabled={vm.isDisabled.get()} danger onClick={() => vm.onStoreChange(mapValues(vm.store.get(), () => null))}>
            Clear All
          </Button>
        </Space>
      </Space>
    );
  }
});
