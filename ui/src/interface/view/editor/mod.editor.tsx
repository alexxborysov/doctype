import { EditorContent, type EditorEvents, useEditor } from '@tiptap/react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { NoteSource } from '~/domain/note';
import { NoteSourceModel } from '~/interface/application/note/source/model';
import { router } from '~/interface/kernel/router/mod.router';
import { debounce } from '~/interface/shared/lib/debounce';
import { extensions } from './extensions/extensions.config';
import './styles.css';
import { EditorToolbar } from './toolbar';

interface Props {
  noteSourceModel: NoteSourceModel;
}

export const EditorView = observer(({ noteSourceModel }: Props) => {
  const handleUpdate = useCallback(
    debounce((event: EditorEvents['update']) => {
      const currentSource = event.editor.getHTML() as NoteSource;
      noteSourceModel.updateSource.run(currentSource);
    }, 700),
    []
  );

  const editor = useEditor({
    content: noteSourceModel.source,
    extensions: extensions,
    onUpdate: handleUpdate,
  });

  useEffect(() => {
    editor?.commands.setContent(noteSourceModel.source || '');
  }, [noteSourceModel.source]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        router.navigate('/');
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (noteSourceModel.init.meta.status !== 'fulfilled') {
    return null;
  }

  return (
    <>
      <EditorContent editor={editor} />
      <EditorToolbar editor={editor} />
    </>
  );
});
