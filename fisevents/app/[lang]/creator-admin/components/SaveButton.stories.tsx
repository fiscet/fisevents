import type { Meta, StoryObj } from '@storybook/react';

import SaveButton, { SaveButtonProps } from './SaveButton';

const meta = {
  component: SaveButton,
} satisfies Meta<SaveButtonProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Save'
  }
};