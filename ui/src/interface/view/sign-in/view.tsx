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
      className="w-[84%] sm:w-[60%] md:w-[55%] lg:w-[43%] xl:w-[38%] 2xl:w-[31%]"
    >
      <Tabs.List justify="center" grow className="mb-5 gap-0 bg-background">
        <Tabs.Tab className="w-[50%]" value={'registration' satisfies Tab}>
          Create An Account
        </Tabs.Tab>
        <Tabs.Tab className="w-[50%]" value={'log-in' satisfies Tab}>
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
