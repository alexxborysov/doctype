import { Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { Login } from '~/interface/application/auth/login/view';
import { Registration } from '~/interface/application/auth/registration/view';
import { signInViewModel } from './model';
import { Tab } from './types';

export const SignIn = observer(() => {
  const handleChangeTab = (key: string | null) => {
    signInViewModel.changeTab(key as Tab);
  };

  return (
    <Tabs
      value={signInViewModel.tab}
      onChange={handleChangeTab}
      variant="pills"
      classNames={{
        tabLabel: 'text-[14.5px]',
        tab: 'aria-[selected="false"]:hover:bg-background data-[active]:bg-cyan-500/10',
      }}
      orientation="horizontal"
      className="w-full"
    >
      <Tabs.List grow className="mb-5 space-x-2 bg-background">
        <Tabs.Tab
          className="max-w-[49%] aria-[selected='false']:bg-cyan-500/10 aria-[selected='false']:active:bg-cyan-500/10 aria-[selected='false']:hover:bg-cyan-500/10 data-[active]:bg-cyan-700"
          value={'registration' satisfies Tab}
        >
          Create An Account
        </Tabs.Tab>
        <Tabs.Tab
          className="max-w-[49%] aria-[selected='false']:bg-cyan-500/10 aria-[selected='false']:active:bg-cyan-500/10 aria-[selected='false']:hover:bg-cyan-500/10 data-[active]:bg-cyan-700"
          value={'log-in' satisfies Tab}
        >
          Log In
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value={'registration' satisfies Tab}>
        <Registration />
      </Tabs.Panel>

      <Tabs.Panel value={'log-in' satisfies Tab}>
        <Login />
      </Tabs.Panel>
    </Tabs>
  );
});
