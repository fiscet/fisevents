import type { Meta, StoryObj } from '@storybook/react';
import AccountLink, { AccountLinkProps } from './AccountLink';
import { CreatorAdminRoutes } from '@/lib/routes';

const meta = {
  component: AccountLink,
} satisfies Meta<AccountLinkProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Account',
    href: CreatorAdminRoutes.getItem('user-account')
  }
};

export const Active: Story = {
  args: {
    label: 'User Account',
    href: ''
  }
};