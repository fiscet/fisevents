import type { Meta, StoryObj } from '@storybook/react';

import LogoutLink from './LogoutLink';
import { fn } from '@storybook/test';

const meta = {
  component: LogoutLink,
} satisfies Meta<typeof LogoutLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Logout',
    onSignOut: fn()
  }
};