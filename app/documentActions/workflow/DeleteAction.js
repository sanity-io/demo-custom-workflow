import PropTypes from 'prop-types'
import React from 'react'
import {TrashIcon} from '@sanity/icons'
import {useDocumentOperation} from '@sanity/react-hooks'
import {inferMetadataState} from '../../lib/workflow/helpers'
import {useWorkflowMetadata} from '../../lib/workflow/metadata'

export function DeleteAction(props) {
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)
  const ops = useDocumentOperation(props.id, props.type)
  const metadata = useWorkflowMetadata(props.id, inferMetadataState(props))

  const onHandle = () => {
    if (ops.delete.disabled) {
      props.onComplete()
      return
    }

    if (!showConfirmDialog) {
      setShowConfirmDialog(true)
      return
    }

    setShowConfirmDialog(false)
    metadata.delete()
    ops.delete.execute()
    props.onComplete()
  }

  return {
    dialog: showConfirmDialog && {
      type: 'confirm',
      message: <div>Sure you want to delete?</div>,
      onConfirm: onHandle,
      onCancel: () => setShowConfirmDialog(false)
    },
    disabled: ops.delete.disabled,
    icon: TrashIcon,
    shortcut: 'mod+shift+d',
    label: 'Delete',
    onHandle
  }
}

DeleteAction.propTypes = {
  id: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
}
