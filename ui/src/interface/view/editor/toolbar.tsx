import { Divider, Kbd, Paper, Portal } from '@mantine/core';
import {
  CodeIcon,
  TextIcon,
  HeadingIcon,
  ActivityLogIcon,
  CheckboxIcon,
  ListBulletIcon,
} from '@radix-ui/react-icons';
import { Editor } from '@tiptap/react';
import { ComponentType, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  return (
    <Portal>
      <Paper
        shadow="sm"
        className="px-3 py-2 fixed bottom-1/2 right-5 transform translate-y-1/2 space-y-2 flex  flex-col items-center justify-center z-50 overflow-hidden"
      >
        <Button
          action={() => editor.chain().focus().setHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          IconSlot={HeadingIcon}
          shortcutKey="Digit1"
        />
        <Button
          action={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          IconSlot={TextIcon}
          shortcutKey="Digit2"
        />
        <Button
          action={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          IconSlot={CheckboxIcon}
          shortcutKey="Digit3"
        />
        <Button
          action={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          IconSlot={CodeIcon}
          shortcutKey="Digit4"
        />
        <Button
          action={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          IconSlot={ListBulletIcon}
          shortcutKey="Digit5"
        />
        <Divider variant="solid" orientation="horizontal" className="h-1 w-4 my-2" />
        <Kbd className="h-7">
          <p className="-mt-[5px] text-[18px]">⌥</p>
        </Kbd>
      </Paper>
    </Portal>
  );
}

function Button({
  shortcutKey,
  action,
  IconSlot,
  isActive,
}: {
  shortcutKey: string;
  action: () => void;
  isActive?: boolean;
  IconSlot: ComponentType<Parameters<typeof ActivityLogIcon>[0]>;
}) {
  const numberLabel = shortcutKey.at(-1);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const triggered = (event.altKey || event.ctrlKey) && event.code === shortcutKey;
      if (triggered) {
        event.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  return (
    <button onClick={action} className="relative w-5 h-5">
      <IconSlot
        className={twMerge('w-[18px] h-[18px] text-zinc-300', isActive && 'text-cyan-400')}
      />
      <span className="absolute -bottom-[4px] -right-[5px] text-[9px] text-gray-500">
        {numberLabel}
      </span>
    </button>
  );
}
