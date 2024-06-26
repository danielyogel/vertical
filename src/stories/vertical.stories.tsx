import { configure } from 'mobx';
import { observable, computed } from 'mobx';
import {
  ArrayN,
  ArrayChild,
  StringN,
  NumberN,
  OneOfN,
  ArrayChildLogical,
  NodeObjectN,
  ArrayChildViewOnly,
  ArrayMainN,
  List,
  ListItem,
  ListItemEdit
} from './initializedNodes';
import { withLoading, withMeta, withProgress, withView, withSelected, withErrors, withDisabled, withVisibility, withId } from '../lib/mixins';
import { NodeContainer } from '../lib';
import { INITIAL_STATE } from './INITIAL_STATE';
import { Button, InputNumber, Space } from 'antd';
import { LoaderOne } from './components';
import { pipe, flow } from 'fp-ts/function';

configure({ enforceActions: 'never' });

const state = observable.box<typeof INITIAL_STATE>(INITIAL_STATE);

const currentIndex = observable.box(1);

const nodeContainer = NodeContainer({
  state: state,
  node: ArrayMainN({
    children: [
      () => {
        return { View: () => <div>EMPTY TAB</div>, id: 'ssdsd' };
      },
      ArrayN({
        isSelected: vm => vm.progress.get() !== 33223 || vm.store.get().id === 21,
        currentIndex: {
          get() {
            return currentIndex.get();
          },
          set(i) {
            currentIndex.set(i);
          }
        },
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
                  details: NodeObjectN({
                    children: {
                      future: StringN({}),
                      past: StringN({}),
                      locations: List({
                        nav: vm => (
                          <div onClick={() => vm.selectedId.set(null)}>
                            <span>click</span>
                            <button>back from nav</button>
                          </div>
                        ),
                        child: ListItem({
                          isDisabled: vm => {
                            return !!vm.value.get().isCapital;
                          },
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
                    },
                    errors: vm => vm.store.get() && []
                  }),
                  lastName: StringN({ placeholder: ({ label }) => `Enter ${label}`, isVisible: ({ store }) => store.get().age !== 3 }),
                  phone: NumberN({ label: 'Phone Custom Title', isVisible: ({ store }) => store.get().name !== 'daniel' }),
                  id: NumberN({ isDisabled: vm => vm.store.get().age === 3 }),
                  gender: OneOfN({ items: (['male', 'female', null] as const).map(k => ({ key: k, title: k })) }),
                  locations: List({
                    nav: vm => (
                      <div onClick={() => vm.selectedId.set(null)}>
                        <span>click</span>
                        <button>back from nav</button>
                      </div>
                    ),
                    child: ListItem({
                      isDisabled: vm => {
                        return !!vm.value.get().isCapital;
                      },
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
  })
});

// reaction(
//   () => state.get(),
//   r => console.log(r)
// );

export const Vertical = () => <nodeContainer.View />;
