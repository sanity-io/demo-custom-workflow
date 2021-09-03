import {CheckmarkIcon} from '@sanity/icons'
import {inferMetadataState, useWorkflowMetadata} from '../../lib/workflow'

export function ApproveAction(props) {
  const metadata = useWorkflowMetadata(props.id, inferMetadataState(props))

  if (metadata.data.state !== 'inReview') {
    return null
  }

  const onHandle = () => {
    metadata.setState('approved')
    props.onComplete()
  }

  return {
    icon: CheckmarkIcon,
    label: 'Approve',
    onHandle
  }
}
