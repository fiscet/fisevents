import type { Meta, StoryObj } from '@storybook/react';

import TooltipSimple from './TooltipSimple';
import { Button } from '@/components/ui/button';

const meta = {
  component: TooltipSimple,
} satisfies Meta<typeof TooltipSimple>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Tooltip label ;-)",
    children: <Button>Hover me!</Button>
  }
};