import type { Meta, StoryObj } from '@storybook/react';

import EventStatusIcon from './EventStatusIcon';

const meta = {
  component: EventStatusIcon,
  decorators: [
    (Story) => (
      <div className="w-20 h-20 p-2 relative flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventStatusIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 'published'
  },
};