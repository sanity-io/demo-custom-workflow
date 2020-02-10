import defaultResolve from 'part:@sanity/base/document-badges'
import {types as workflowTypes} from '../config/workflow'
import {resolveWorkflowDocumentBagdes} from './workflow'

export default function resolveDocumentBadges(props) {
  if (workflowTypes.includes(props.type)) {
    return resolveWorkflowDocumentBagdes(props)
  }

  return defaultResolve(props)
}
