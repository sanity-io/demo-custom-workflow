import {defineType, defineField} from 'sanity'
import {ComposeIcon} from '@sanity/icons'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'content',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      // subtitle: '_id',
      media: 'image',
    },
  },
})
