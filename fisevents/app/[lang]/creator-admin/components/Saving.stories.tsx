import type { Meta, StoryObj } from '@storybook/react';

import Saving from './Saving';

const meta = {
  component: Saving,
} satisfies Meta<typeof Saving>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};