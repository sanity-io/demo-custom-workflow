import PropTypes from 'prop-types'
import React from 'react'
import {EyeOpenIcon} from '@sanity/icons'

import {inferMetadataState, useWorkflowMetadata} from '../../lib/workflow'
import RequestReviewWizard from '../../components/RequestReviewWizard'

export function RequestReviewAction(props) {
  const [showWizardDialog, setShowWizardDialog] = React.useState(false)
  const metadata = useWorkflowMetadata(props.id, inferMetadataState(props))
  const {state} = metadata.data

  if (!props.draft || state === 'inReview' || state === 'approved') {
    return null
  }

  const onHandle = () => {
    if (!showWizardDialog) {
      setShowWizardDialog(true)
    }
  }

  const onSend = assignees => {
    setShowWizardDialog(false)

    if (assignees.length === 0) {
      metadata.clearAssignees()
    } else {
      metadata.setAssignees(assignees)
    }

    metadata.setState('inReview')
    props.onComplete()
  }

  const onClose = () => setShowWizardDialog(false)

  return {
    dialog: showWizardDialog && {
      type: 'popover',
      content: <RequestReviewWizard metadata={metadata.data} onClose={onClose} onSend={onSend} />,
      onClose: props.onComplete
    },
    disabled: showWizardDialog,
    icon: EyeOpenIcon,
    label: 'Request review',
    onHandle
  }
}

RequestReviewAction.propTypes = {
  draft: PropTypes.object,
  id: PropTypes.string,
  onComplete: PropTypes.func
}
