import { observer } from 'mobx-react-lite';
import { useLayoutEffect } from 'react';
import { Transition } from '~/interface/shared/view/transition';
import { QuickStart } from '~/interface/view/quick-start';
import { notesManagerModel } from '../model';
import { Preview } from './preview';

export const NotesPool = observer(() => {
  const pool = notesManagerModel.pool;

  useLayoutEffect(() => {
    if (notesManagerModel.pull.meta.status === 'fulfilled') {
      notesManagerModel.pull.run();
    }
  }, []);

  if (!pool.length) {
    return notesManagerModel.pull.meta.status === 'fulfilled' && <QuickStart />;
  } else {
    return (
      <Transition>
        <ul className="justify-start align-top items-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full gap-y-12 gap-x-16 pb-20 px-8">
          {pool?.map((doc) => {
            return <Preview key={doc.id} {...doc} />;
          })}
        </ul>
      </Transition>
    );
  }
});
