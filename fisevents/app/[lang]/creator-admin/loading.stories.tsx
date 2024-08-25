import type { Meta, StoryObj } from '@storybook/react';

import Loading from './loading';

const meta = {
  component: Loading,
  decorators: [(story) => <div className='w-52 h-52'>{story()}</div>],
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};