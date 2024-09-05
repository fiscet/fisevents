import type { Meta, StoryObj } from '@storybook/react';

import Editor from './Editor';

const meta = {
  component: Editor,
} satisfies Meta<typeof Editor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    markdown: 'Tityre, tu patulae recubans sub tegmine fagi silvestrem tenui musam meditaris avena',
    onChange: function (value: string) {  console.log(value); }
  }
};

export const With_Title: Story = {
  args: {
    markdown: '#MELIBOEUS \n Tityre, tu patulae recubans sub tegmine fagi silvestrem tenui musam meditaris avena', 
    onChange: function (value: string) {  console.log(value); }
  }
};

export const With_Bold: Story = {
  args: {
    markdown: '**MELIBOEUS**\nTityre, tu patulae recubans sub tegmine fagi silvestrem tenui musam meditaris avena', 
    onChange: function (value: string) {  console.log(value); }
  }
};