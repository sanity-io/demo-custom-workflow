import CheckIcon from 'part:@sanity/base/check-icon'
import {inferMetadataState, useWorkflowMetadata} from '../../lib/workflow'

export const approveAction = props => {
  const metadata = useWorkflowMetadata(props.id, inferMetadataState(props))

  if (metadata.data.state !== 'inReview') {
    return null
  }

  const onHandle = () => {
    metadata.setState('approved')
    // metadata.commit()
    props.onComplete()
  }

  return {
    icon: CheckIcon,
    label: 'Approve',
    onHandle
  }
}
