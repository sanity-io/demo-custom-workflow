import {approveAction} from './approve'
import {deleteAction} from './delete'
import {discardChangesAction} from './discardChanges'
import {publishAction} from './publish'
import {requestChangesAction} from './requestChanges'
import {requestReviewAction} from './requestReview'
import {syncAction} from './sync'
import {unpublishAction} from './unpublish'

export function resolveWorkflowActions(/* docInfo */) {
  return [
    syncAction,
    requestReviewAction,
    approveAction,
    requestChangesAction,
    publishAction,
    unpublishAction,
    discardChangesAction,
    deleteAction
  ]
}
