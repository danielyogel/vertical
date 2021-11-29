import React from 'react';
import NodeArrayChild from '../lib/nodes/NodeArrayChild';
import NodeArrayChildLogical from '../lib/nodes/NodeArrayChildLogical';
import { NodeScalar } from '../lib';
import { Button, InputNumber, Space, Input, Radio, Divider, Typography } from 'antd';
import { pipe, mapWithIndexArr, sortBy } from '../utils';
import NodeArray from '../lib/nodes/NodeArray';
import NodeOneOf from '../lib/nodes/NodeOneOf';
import classnames from 'classnames';
import { INITIAL_STATE } from './INITIAL_STATE';
import { LoaderOne, LoaderTwo } from './storyComponents';
import DynamicArray from '../lib/nodes/NodeDynamicArray';
import NodeDynamicArrayChild from '../lib/nodes/NodeDynamicArrayChild';
import NodeObject from '../lib/nodes/NodeObject';

export const NumberN = NodeScalar<number | null, typeof INITIAL_STATE>({
  Render: ({ value, onChange, setLoading, isLoading, label }) => {
    const v = value.get();
    const toggleLoading = () => setLoading(!isLoading.get());

    return (
      <Space>
        {label.get() && <Typography.Title level={5}>{label.get()}</Typography.Title>}
        <InputNumber value={!v ? undefined : v} onChange={onChange} />
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

export const StringN = NodeScalar<string | null, typeof INITIAL_STATE>({
  Render: ({ value, onChange, setLoading, isLoading, errors, label, placeholder }) => {
    const v = value.get();
    const toggleLoading = () => setLoading(!isLoading.get());

    return (
      <Space>
        {label.get() && <Typography.Title level={5}>{label.get()}</Typography.Title>}

        <div>
          <Input value={v === null ? '' : v} onChange={e => onChange(e.target.value)} placeholder={placeholder.get()} />
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

export const OneOfN = NodeOneOf<typeof INITIAL_STATE>({
  Render: ({ value, onChange, setLoading, isLoading, errors, items, label }) => {
    const toggleLoading = () => setLoading(!isLoading.get());

    return (
      <Space>
        <b className="inline-block capitalize w-16 pr-1">{String(label.get())}</b>

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

export const ArrayChild = NodeArrayChild<typeof INITIAL_STATE>({
  Render: ({ children, isLoading, back, next, isFirst, isLast, isDisabled }) => {
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

        <Space>
          {!isFirst.get() && (
            <Button onClick={back} disabled={isDisabled.get()}>
              Back
            </Button>
          )}
          {!isLast.get() && (
            <Button onClick={next} disabled={isDisabled.get()}>
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
    );
  }
});

export const ArrayChildViewOnly = NodeArrayChild<typeof INITIAL_STATE>({
  Render: ({ children, errors }) => {
    const hasError = Boolean(errors.get().length);

    return (
      <Space direction="vertical" style={{ backgroundColor: hasError ? 'red' : 'white' }}>
        {Object.entries(children).map(([_, node]) => {
          return <node.View key={node.id} />;
        })}
      </Space>
    );
  }
});

export const NodeObjectN = NodeObject<typeof INITIAL_STATE>({
  Render: ({ children, errors }) => {
    const hasError = Boolean(errors.get().length);

    return (
      <Space direction="vertical" style={{ backgroundColor: hasError ? 'red' : 'white' }}>
        {Object.entries(children).map(([_, node]) => {
          return <node.View key={node.id} />;
        })}
      </Space>
    );
  }
});

export const ArrayChildLogical = NodeArrayChildLogical<typeof INITIAL_STATE>({
  Render: ({ children, isLoading, back, next, isFirst, isLast, isDisabled }) => {
    return (
      <Space direction="vertical">
        <div>
          {isLoading.get() && (
            <>
              <LoaderOne />
              <span className="ml-3 text-green-600">Loading...</span>
            </>
          )}
        </div>
        <Space direction="vertical">
          {Object.entries(children).map(([_, node]) => {
            return (
              <div key={node.id}>
                <node.View />
                <Divider />
              </div>
            );
          })}
        </Space>

        <Space>
          {!isFirst.get() && (
            <Button onClick={back} disabled={isDisabled.get()}>
              Back
            </Button>
          )}
          {!isLast.get() && (
            <Button onClick={next} disabled={isDisabled.get()}>
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
    );
  }
});

export const ArrayN = NodeArray<typeof INITIAL_STATE>({
  Render: vm => {
    return (
      <Space direction="vertical">
        <Space>
          {pipe(
            [...vm.children],
            mapWithIndexArr((indwx, node) => vm.currentIndex.get() === indwx + 1 && <node.View key={indwx} />)
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

          {/* <ul>
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
          </ul> */}
          <Button
            type="primary"
            disabled={vm.isDisabled.get()}
            danger
            onClick={() => {
              // vm.onStoreChange(mapValues(vm.store.get(), () => null));
            }}
          >
            Clear All
          </Button>
        </Space>
      </Space>
    );
  }
});

export const ArrayMainN = NodeArray<typeof INITIAL_STATE>({
  Render: vm => {
    return (
      <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', paddingRight: '10px' }}>
        <div style={{ width: '100px', flexShrink: 0 }}>
          <div>
            <button style={{ cursor: 'pointer' }} onClick={() => vm.currentIndex.set(vm.currentIndex.get() === 1 ? 2 : 1)}>
              toggle View
            </button>
          </div>
          {vm.currentIndex.get() === 2 && (
            <div>
              <button style={{ cursor: 'pointer' }} onClick={() => vm.children[1]?.currentIndex?.set(1)}>
                one
              </button>
              <button style={{ cursor: 'pointer' }} onClick={() => vm.children[1]?.currentIndex?.set(2)}>
                two
              </button>
            </div>
          )}
        </div>
        <div style={{ flexGrow: 1, padding: '10px' }}>
          {pipe(
            [...vm.children],
            mapWithIndexArr((indwx, node) => vm.currentIndex.get() === indwx + 1 && <node.View key={indwx} />)
          )}
        </div>
      </div>
    );
  }
});

export const List = DynamicArray<typeof INITIAL_STATE>({
  Render: ({ children, add, onChange, value, selectedChild, selectedId, Navigation }) => {
    const vm = selectedChild.get();

    return (
      <div>
        {Navigation ? <Navigation /> : null}

        {(() => {
          if (vm) {
            return <vm.View />;
          } else
            return (
              <div style={{ border: '1px solid green', borderRadius: '10px', padding: '20px 5px ' }}>
                <div>
                  <Button type="primary" onClick={() => add()} style={{ marginRight: '10px' }}>
                    Add List Item
                  </Button>
                  <Button
                    type="default"
                    onClick={() => {
                      onChange(sortBy(value.get(), 'id'));
                    }}
                  >
                    Reorder List
                  </Button>
                </div>
                <div style={{ margin: '5px', padding: '5px' }}>
                  {children.get().map((currChild, currIndex) => {
                    return (
                      <div key={currChild?.id ?? currIndex}>
                        <div onClick={() => selectedId.set(currChild.id || null)}>edit</div>
                        <currChild.View />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
        })()}
      </div>
    );
  }
});

export const ListItem = NodeDynamicArrayChild<typeof INITIAL_STATE>({
  Render: ({ children, errors, remove }) => {
    const hasError = Boolean(errors.get().length);

    return (
      <Space direction="vertical" style={{ backgroundColor: hasError ? 'red' : 'lightgray', padding: '20px', margin: '10px' }}>
        {Object.entries(children).map(([_, node]) => {
          return <node.View key={node.id} />;
        })}
        <Button type="default" color="red" onClick={remove} style={{ marginRight: '10px' }}>
          Remove
        </Button>
      </Space>
    );
  }
});

export const ListItemEdit = NodeDynamicArrayChild<typeof INITIAL_STATE>({
  Render: ({ children, errors, remove, setSelectedId }) => {
    const hasError = Boolean(errors.get().length);

    return (
      <Space direction="vertical" style={{ backgroundColor: hasError ? 'red' : 'lightgray', padding: '20px', margin: '10px' }}>
        {Object.entries(children).map(([_, node]) => {
          return <node.View key={node.id} />;
        })}
        <Button type="default" color="red" onClick={remove} style={{ marginRight: '10px' }}>
          Remove
        </Button>
        <Button type="default" color="red" onClick={() => setSelectedId(null)} style={{ marginRight: '10px' }}>
          Back
        </Button>
      </Space>
    );
  }
});
