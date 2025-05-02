import { type ReactNode } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { BaseLoader } from './loader';

interface Props {
  isAppLoading: boolean;
  appMenuSlot?: ReactNode;
}

export function Layout({ isAppLoading, appMenuSlot }: Props) {
  return (
    <>
      {isAppLoading ? (
        <BaseLoader size="lg" color="blue" className="absolute top-[45vh] left-[50%]" />
      ) : (
        <main className="flex flex-row relative font-sans">
          <section className="overflow-hidden fixed top-0 left-0 min-h-screen h-screen px-3 z-50">
            {appMenuSlot}
          </section>

          <section className="py-4 pl-16 min-w-full z-0 relative overflow-x-hidden ">
            <Outlet />
          </section>

          <ScrollRestoration />
        </main>
      )}
    </>
  );
}
