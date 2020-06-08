import EditIcon from 'part:@sanity/base/edit-icon'
import {inferMetadataState, useWorkflowMetadata} from '../../lib/workflow'

export function requestChangesAction(props) {
  const metadata = useWorkflowMetadata(props.id, inferMetadataState(props))

  if (metadata.data.state !== 'inReview') {
    return null
  }

  const onHandle = () => {
    metadata.setState('changesRequested')
    props.onComplete()
  }

  return {
    icon: EditIcon,
    label: 'Request changes',
    onHandle
  }
}
