import defaultResolver from 'part:@sanity/base/document-actions'
import {types as workflowTypes} from '../config/workflow'
import {resolveWorkflowActions} from './workflow'

export default function resolveDocumentActions(docInfo) {
  if (workflowTypes.includes(docInfo.type)) {
    return resolveWorkflowActions(docInfo)
  }

  return defaultResolver(docInfo)
}
