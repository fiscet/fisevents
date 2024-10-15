import type { Meta, StoryObj } from '@storybook/react';

import PublishedIcon from './PublishedIcon';

const meta = {
  component: PublishedIcon,
  decorators: [
    (Story) => (
      <div className="w-20 h-20 p-2 relative flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PublishedIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isPublished: true,
  },
};