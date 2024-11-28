import { Button, Kbd, MantineProvider, TextInput, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { type ReactNode } from 'react';

const theme = createTheme({
  fontFamily: 'Roboto',
  fontSizes: { sm: '0.87rem', md: '0.94rem' },
  components: {
    TextInput: TextInput.extend({
      classNames: {
        input: 'text-fontPrimary border-borderDark focus:border-accent',
      },
    }),
    Button: Button.extend({
      classNames: {
        label: 'font-[500]',
      },
    }),
    Kbd: Kbd.extend({
      classNames: {
        root: 'text-[0.87rem] px-[8px] text-gray-400',
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
