import {
  Button,
  Combobox,
  Kbd,
  MantineProvider,
  Paper,
  TextInput,
  createTheme,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { type ReactNode } from 'react';

const theme = createTheme({
  fontFamily: 'Roboto',
  fontSizes: { sm: '0.87rem', md: '0.94rem' },
  colors: {
    zinc: [
      'oklch(0.985 0 0)', // zinc-50 (index 0)
      'oklch(0.967 0.001 286.375)', // zinc-100 (index 1)
      'oklch(0.92 0.004 286.32)', // zinc-200 (index 2)
      'oklch(0.871 0.006 286.286)', // zinc-300 (index 3)
      'oklch(0.705 0.015 286.067)', // zinc-400 (index 4)
      'oklch(0.552 0.016 285.938)', // zinc-500 (index 5)
      'oklch(0.442 0.017 285.786)', // zinc-600 (index 6)
      'oklch(0.37 0.013 285.805)', // zinc-700 (index 7)
      'oklch(0.274 0.006 286.033)', // zinc-800 (index 8)
      'oklch(0.21 0.006 285.885)', // zinc-900 (index 9)
    ],
  },
  primaryColor: 'cyan',
  components: {
    TextInput: TextInput.extend({
      classNames: {
        input:
          'text-foreground border-border transition-none bg-zinc-900 focus:border-cyan-600',
      },
    }),
    Button: Button.extend({
      classNames: {
        label: 'font-[500]',
      },
    }),
    Kbd: Kbd.extend({
      classNames: {
        root: 'text-[0.87rem] px-[8px] text-gray-400 bg-zinc-800',
      },
    }),
    Paper: Paper.extend({
      classNames: {
        root: 'bg-secondary',
      },
    }),
    Combobox: Combobox.extend({
      classNames: {
        search: 'bg-zinc-900',
        empty: 'text-zinc-400',
        dropdown: 'bg-zinc-900 border-zinc-800',
        option:
          'text-zinc-200 hover:bg-zinc-700/40 data-[combobox-selected]:bg-zinc-800 data-[combobox-selected]:text-zinc-100',
        options: 'bg-zinc-900',
      },
    }),
  },
});

export const WithMantine = (component: () => ReactNode) => () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      {component()}
    </MantineProvider>
  );
};
