// import React from 'react';
// import { configure } from 'mobx';
// import { Meta, Story } from '@storybook/react/types-6-0';
// import { observable, computed } from 'mobx';
// import { NodeList, NumberN, ArrayChild } from './storyRenderers';
// import { INITIAL_STATE } from './INITIAL_STATE';

// configure({ enforceActions: 'never' });

// const state = observable.box<typeof INITIAL_STATE>(INITIAL_STATE);

// const nodeaa = ArrayMainN({
//   children: [
//     () => {
//       return { View: () => <div>daniel</div>, id: 'ssdsd' };
//     },
//     ArrayN({
//       isSelected: vm => vm.progress.get() !== 33223 || vm.store.get().id === 21,
//       children: [
//         ArrayChild({
//           children: {
//             id: NumberN({}),
//             birthday: NumberN({ isVisible: ({ store }) => store.get().name !== 'daniel' })
//           }
//         })
//       ] as const
//     })
//   ]
// });

// const vm = nodeaa({
//   value: computed(() => state.get()),
//   onChange: c => state.set({ ...state.get(), ...c }),
//   store: computed(() => state.get()),
//   onStoreChange: change => state.set({ ...state.get(), ...change })
// });

// export default {
//   title: 'NodeObject',
//   component: vm.View
// } as Meta;

// const Template: Story<{}> = args => <vm.View {...args} />;

// export const FirstStory = Template.bind({});
