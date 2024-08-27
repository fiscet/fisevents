import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Logo from './Logo';

const meta = {
  title: 'Common/Logo',
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
