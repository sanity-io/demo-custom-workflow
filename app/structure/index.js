import S from '@sanity/desk-tool/structure-builder'
import {workflowListItems} from './workflow'

const HIDDEN_TYPES = [
  // NOTE: comment this to debug
  'workflow.metadata'
]

const hiddenDocTypes = listItem => !HIDDEN_TYPES.includes(listItem.getId())

const docTypeListItems = S.documentTypeListItems().filter(hiddenDocTypes)

export default () =>
  S.list()
    .title('Content')
    .items([...workflowListItems, ...docTypeListItems])
