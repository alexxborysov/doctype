import BulletList from '@tiptap/extension-bullet-list';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import StarterKit from '@tiptap/starter-kit';
import { CodeBlockExtended } from './code-block';
import { lowlight } from './lowlight';
import { TaskItemExtended, TaskListExtended } from './task-list';

export const extensions = [
  StarterKit.configure({
    codeBlock: false,
    bulletList: false,
    orderedList: false,
    listItem: false,
  }),

  TaskListExtended,
  TaskItemExtended.configure({
    nested: true,
  }),

  CodeBlockExtended,
  CodeBlockLowlight.configure({
    lowlight,
  }),

  BulletList.configure({
    HTMLAttributes: {
      class: 'bulletList',
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: 'orderedList',
    },
  }),

  ListItem,
];
