import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { NOTIFICATION_TYPES } from '@/types/custom.types';
import { NotificationBar, NotificationBarProps } from './NotificationBar';

const meta = {
  component: NotificationBar,
  decorators: [
    (Story) => (
      <div className="min-w-96">
        <Story />
      </div>
    )
  ],
  argTypes: {
    type: {
      control: 'select',
      options: NOTIFICATION_TYPES
    }
  }
} satisfies Meta<NotificationBarProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    title: 'Title',
    message: 'Long Info message or description',
    type: 'info',
    onClose: fn()
  }
};

export const Warning: Story = {
  args: {
    title: 'Title',
    message: 'Long Warning message or description',
    type: 'warning',
    onClose: fn()
  }
};

export const Success: Story = {
  args: {
    title: 'Title',
    message: 'Long Success message or description',
    type: 'success',
    onClose: fn()
  }
};

export const Error: Story = {
  args: {
    title: 'Title',
    message: 'Long Error message or description',
    type: 'error',
    onClose: fn()
  }
};

export const None: Story = {
  args: {
    title: 'Title',
    message: 'Long Error message or description',
    type: 'none',
    onClose: fn()
  }
};