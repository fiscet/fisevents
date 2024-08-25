import type { Meta, StoryObj } from '@storybook/react';
import AccountLink, { AccountLinkProps } from './AccountLink';

const meta = {
  component: AccountLink,
} satisfies Meta<AccountLinkProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Account',
  }
};

export const Active: Story = {
  args: {
    label: 'Account',
    pathname: '/account'
  }
};