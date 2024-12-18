import type { Meta, StoryObj } from '@storybook/react';

import PopoverSimple from './PopoverSimple';
import { Button } from '@/components/ui/button';

const meta = {
  component: PopoverSimple,
} satisfies Meta<typeof PopoverSimple>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Tooltip label ;-)",
    children: <Button>Hover me!</Button>
  }
};