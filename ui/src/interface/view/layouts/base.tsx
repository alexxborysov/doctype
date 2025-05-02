import { Layout } from '~/interface/shared/view/layout';
import { AppNavigation } from '../navigation';

export const BaseLayout = () => {
  return <Layout isAppLoading={false} appMenuSlot={<AppNavigation />} />;
};
