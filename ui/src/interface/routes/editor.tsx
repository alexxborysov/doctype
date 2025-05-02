import { m } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { NoteId } from '~/domain/note';
import { notesManagerModel } from '../application/note/manager/model';
import { NoteSourceModel } from '../application/note/source/model';
import { router } from '../kernel/router/mod.router';
import { notifications } from '../shared/lib/notifications';
import { BaseLoader } from '../shared/view/loader';

const EditorView = lazy(async () =>
  import('~/interface/view/editor/mod.editor').then((mod) => ({ default: mod.EditorView }))
);

export const Editor = () => {
  const searchParams = useParams();
  const noteId = searchParams?.noteId as NoteId;

  if (!noteId?.length) {
    router.navigate('/');
    notifications.noteNotFound();
  }

  return (
    <m.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.12,
        ease: 'easeIn',
      }}
      className="flex w-full px-[1%] lg:px-[2%] items-start justify-center relative min-h-[95vh]"
    >
      <Suspense fallback={<BaseLoader position="centered" />}>
        <EditorView noteSourceModel={new NoteSourceModel({ id: noteId }, notesManagerModel)} />
      </Suspense>
    </m.main>
  );
};
