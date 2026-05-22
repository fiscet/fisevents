import {defineField, defineType} from 'sanity'
import {GrFormAdd} from 'react-icons/gr'

export default defineType({
  title: 'Custom Field',
  name: 'customFieldDef',
  type: 'object',
  icon: GrFormAdd,
  fields: [
    defineField({
      title: 'Label',
      name: 'label',
      type: 'string',
      description: 'Label shown to the attendant on the subscription form',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Field key',
      name: 'name',
      type: 'string',
      description: 'Stable internal key (auto-generated from the label)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Type',
      name: 'fieldType',
      type: 'string',
      options: {
        list: [
          {title: 'Text', value: 'text'},
          {title: 'Number', value: 'number'},
          {title: 'Select', value: 'select'},
          {title: 'Checkbox', value: 'checkbox'},
        ],
        layout: 'radio',
      },
      initialValue: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Required',
      name: 'required',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      title: 'Options',
      name: 'options',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Available choices (only used for Select fields)',
      hidden: ({parent}) => parent?.fieldType !== 'select',
    }),
  ],
  preview: {
    select: {
      label: 'label',
      fieldType: 'fieldType',
      required: 'required',
    },
    prepare({label, fieldType, required}) {
      return {
        title: label,
        subtitle: `${fieldType ?? 'text'}${required ? ' · required' : ''}`,
      }
    },
  },
})
