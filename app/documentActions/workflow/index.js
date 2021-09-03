import {ApproveAction} from './ApproveAction'
import {DeleteAction} from './DeleteAction'
import {DiscardChangesAction} from './DiscardChangesAction'
import {PublishAction} from './PublishAction'
import {RequestChangesAction} from './RequestChangesAction'
import {RequestReviewAction} from './RequestReviewAction'
import {SyncAction} from './SyncAction'
import {UnpublishAction} from './Unpublish'

export function resolveWorkflowActions(/* docInfo */) {
  return [
    SyncAction,
    RequestReviewAction,
    ApproveAction,
    RequestChangesAction,
    PublishAction,
    UnpublishAction,
    DiscardChangesAction,
    DeleteAction
  ]
}
