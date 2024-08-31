import type { Meta, StoryObj } from '@storybook/react';

import Processing from './Processing';

const meta = {
  component: Processing,
} satisfies Meta<typeof Processing>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};