export default {
  type: 'document',
  name: 'post',
  title: 'Post',
  fields: [
    {type: 'string', name: 'title', title: 'Title'},
    {type: 'datetime', name: 'publishedAt', title: 'Published at'},
    {type: 'image', name: 'image', title: 'Image'}
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'image'
    }
  }
}
