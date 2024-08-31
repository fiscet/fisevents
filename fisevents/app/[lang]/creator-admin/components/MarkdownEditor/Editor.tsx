'use client';

import {
  MDXEditor,
  MDXEditorMethods,
  toolbarPlugin,
  headingsPlugin,
  quotePlugin,
  linkPlugin,
  linkDialogPlugin,
  listsPlugin,
  tablePlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertTable
} from '@mdxeditor/editor';
import './Editor.css';
import { FC } from 'react';
import { Separator } from '@radix-ui/react-separator';

interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
  onChange: (value: string) => void;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor: FC<EditorProps> = ({ markdown, editorRef, onChange }) => {
  return (
    <MDXEditor
      onChange={onChange}
      ref={editorRef}
      markdown={markdown}
      className="border"
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        listsPlugin(),
        tablePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <CreateLink />
              <Separator />
              <InsertTable />
            </>
          )
        })
      ]}
    />
  );
};

export default Editor;
