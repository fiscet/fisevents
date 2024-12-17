import type { Meta, StoryObj } from '@storybook/react';

import ImageUploader, { ImageUploaderProps } from './ImageUploader';

const meta = {
  component: ImageUploader,
} satisfies Meta<ImageUploaderProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    boxSize: 320,
    initImageUrl: '/stories/img-2.jpg',
    img: {
      file: {} as File,
      imgUrl: ''
    },
    setImg: () => {},
    onRestore: () => {},
    onDelete: () => {}
  },
};

export const WithImageUploaded: Story = {
  args: {
    boxSize: 320,
    initImageUrl: '/stories/img-2.jpg',
    img: {
      file: {} as File,
      imgUrl: '/stories/img-1.png'
    },
    setImg: () => {},
    onRestore: () => { },
    onDelete: () => {}
  },
};