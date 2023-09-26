import type { StoryDefault } from '@ladle/react';
import { NextUIProvider } from '@nextui-org/react';

export default {
  decorators: [
    Component => (
      <NextUIProvider>
        <Component />
      </NextUIProvider>
    )
  ]
} satisfies StoryDefault;
