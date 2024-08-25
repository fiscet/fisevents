import type { Meta, StoryObj } from '@storybook/react';

import DotBg, { DotBgProps } from './DotBg';

const meta = {
  component: DotBg,
} satisfies Meta<DotBgProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: '#eee',
    size: 1,
    spacing: 20,
    children: <div className='w-60 h-60 bg-black/50 flex items-center justify-center'>
      <div className='text-white'>
        <h1 className='text-xl'>Hello</h1>
      </div>
    </div>
  },
};