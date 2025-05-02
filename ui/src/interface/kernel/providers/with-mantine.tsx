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
    Notifications: Notifications.extend({
      classNames: {
        notification: 'bg-secondary',
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
