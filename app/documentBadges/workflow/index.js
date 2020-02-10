import {useWorkflowMetadata} from '../../lib/workflow/metadata'
import {inferMetadataState} from '../../lib/workflow/helpers'
import {states} from '../../config/workflow'

function publishedBadge(docInfo) {
  if (!docInfo.published) {
    return null
  }

  return {
    label: 'Published',
    title: 'Published',
    color: 'success'
  }
}

function workflowBadge(docInfo) {
  const metadata = useWorkflowMetadata(docInfo.id, inferMetadataState(docInfo))
  const state = states.find(s => s.id === metadata.data.state)

  if (!state) return null
  // if (!docInfo.draft && state.id === 'published') return null

  if (docInfo.draft && state.id === 'published') {
    return {
      label: 'Draft',
      title: 'Draft'
    }
  }

  if (state.id === 'published') {
    return null
  }

  return {
    label: state.title,
    title: state.title,
    color: state.color
  }
}

export function resolveWorkflowDocumentBagdes(/* docInfo */) {
  return [publishedBadge, workflowBadge]
}
