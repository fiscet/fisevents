import { defineType, defineArrayMember } from 'sanity';

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',

      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      fields: [
        {
          title: 'Description of the image for screen readers',
          name: 'alt',
          description: '⚡ Optional but highly encouraged to make content more accessible for visually impaired folks.',
          type: 'string',
        },
        {
          title: 'Size',
          name: 'size',
          type: 'string',
          initialValue: 'orig',
          options: {
            list: [
              {
                value: 'sm',
                title: 'Small'
              },
              {
                value: 'md',
                title: 'Medium'
              },
              {
                value: 'lg',
                title: 'Large'
              },
              {
                value: 'orig',
                title: 'Original'
              },
            ]
          }
        },
        {
          title: 'Alignment',
          name: 'alignment',
          type: 'string',
          initialValue: 'center',
          options: {
            layout: 'radio',
            list: [
              {
                value: 'left',
                title: 'Left'
              },
              {
                value: 'center',
                title: 'Center'
              },
              {
                value: 'right',
                title: 'Right'
              },
            ]
          }
        },
      ],
      options: { hotspot: true },
    }),
  ],
});
