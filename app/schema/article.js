const textComponent = (name, filters = []) => ({
  name,
  type: 'object',
  fields: [
    {name: 'size', type: 'string', hidden: () => filters.includes('size')},
    {name: 'tone', type: 'string', hidden: () => filters.includes('tone')}
  ]
})

export default {
  name: 'article',
  type: 'document',
  fields: [textComponent('title', ['size', 'tone']), textComponent('subtitle', ['size'])]
}
