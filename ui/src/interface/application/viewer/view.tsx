import { Avatar } from '@mantine/core';
import { EnterIcon } from '@radix-ui/react-icons';
import { m } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useNetworkState } from '~/interface/kernel/network/use-network-state';
import { NavigationButton } from '~/interface/shared/view/buttons/navigation';
import { viewerModel } from './model';

export const SessionAction = observer(() => {
  const network = useNetworkState();
  const session = viewerModel.viewer;

  const logout = () => {
    viewerModel.logout();
  };

  if (!session && network.online) {
    return (
      <NavigationButton
        className="px-[9.5px] py-[7px] "
        pushTo="/sign-in"
        content={<EnterIcon className="w-[1.19rem] h-[1.19rem] text-accent -ml-[0.5px]" />}
        ariaLabel="sign-in"
      />
    );
  }

  if (session && network.online) {
    return (
      <m.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.2,
          ease: 'easeIn',
        }}
        className="w-[38px] h-[33px] flex items-center justify-center"
      >
        <Avatar
          styles={{ root: { cursor: 'pointer', marginBottom: '4px' } }}
          src="/logo.webp"
          size="sm"
          onClick={logout}
        />
      </m.div>
    );
  }
});
