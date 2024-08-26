import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SignInWithGoogle, { SignInWithGoogleProps } from './SignInWithGoogle';

const meta = {
  component: SignInWithGoogle,
  decorators: [(story) => <div className='w-80'>{story()}</div>],
} satisfies Meta<SignInWithGoogleProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dictionary: {
      title: 'Sign in with Google',
    },
    onSignIn:  fn()
  }
};