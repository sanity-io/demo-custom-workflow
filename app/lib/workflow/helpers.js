export function inferMetadataState(props) {
  if (!props.draft && !props.published) return 'draft'
  if (props.draft) return 'draft'
  return 'published'
}
