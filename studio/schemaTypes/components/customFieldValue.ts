import {defineField, defineType} from 'sanity'
import {GrFormEdit} from 'react-icons/gr'

export default defineType({
  title: 'Custom Field Value',
  name: 'customFieldValue',
  type: 'object',
  icon: GrFormEdit,
  fields: [
    defineField({
      title: 'Field key',
      name: 'name',
      type: 'string',
    }),
    defineField({
      title: 'Label',
      name: 'label',
      type: 'string',
    }),
    defineField({
      title: 'Value',
      name: 'value',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      label: 'label',
      value: 'value',
    },
    prepare({label, value}) {
      return {
        title: label,
        subtitle: value,
      }
    },
  },
})
