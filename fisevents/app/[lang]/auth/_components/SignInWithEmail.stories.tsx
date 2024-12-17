import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SignInWithEmail, { SignInWithEmailProps } from './SignInWithEmail';

const meta = {
  component: SignInWithEmail,
  decorators: [(story) => <div className='w-80'>{story()}</div>],
} satisfies Meta<SignInWithEmailProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSignIn:  fn()
  }
};