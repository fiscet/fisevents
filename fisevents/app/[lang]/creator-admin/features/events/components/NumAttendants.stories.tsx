import type { Meta, StoryObj } from '@storybook/react';

import NumAttendants from './NumAttendants';

const meta = {
  component: NumAttendants,
} satisfies Meta<typeof NumAttendants>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};