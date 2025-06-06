import { Divider, Kbd, Paper, Portal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { cn } from '~/interface/shared/lib/cn';
import { Transition } from '~/interface/shared/view/transition';
import { Search } from '../../search/view';
import { notesManagerModel } from '../model';

export const Toolbar = observer(() => {
  const hidden = !notesManagerModel.pool.length;

  useEffect(() => {
    const handleCreateShortcut = (event: KeyboardEvent) => {
      const triggered = event.altKey && event.code === 'KeyN';
      if (triggered) {
        event.preventDefault();
        notesManagerModel.create.run();
      }
    };

    window.addEventListener('keydown', handleCreateShortcut);
    return () => {
      window.removeEventListener('keydown', handleCreateShortcut);
    };
  }, []);

  return (
    <Portal>
      <Transition>
        <Paper
          shadow="sm"
          className={cn(
            'px-3 py-2 fixed bottom-5 left-[50%] transform -translate-x-[50%] space-x-3 flex items-center justify-center z-50 overflow-hidden',
            hidden && 'hidden'
          )}
        >
          <Search />

          <Divider orientation="vertical" className="h-4 my-auto" />

          <Kbd className="h-[30px]">
            <div className="-mt-1 flex items-center space-x-1">
              <p className="text-[18px]">⌥</p>
              <p className="text-[14px]">N</p>
            </div>
          </Kbd>
        </Paper>
      </Transition>
    </Portal>
  );
});
