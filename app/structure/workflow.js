import S from '@sanity/desk-tool/structure-builder'
import {filter, map, switchMap} from 'rxjs/operators'
import {FiTag} from 'react-icons/fi'
import userDatastore from 'part:@sanity/base/user'

import {getDocumentMutations$, getDocumentQuery$} from '../lib/document'

const WORKFLOW_DOCUMENTS_FILTER = `_type == $type && $userId in assignees`
const WORKFLOW_DOCUMENTS_QUERY = `
  * [_type == $type && $userId in assignees] {
    ...coalesce(
      *[_id == "drafts." + ^.documentId]{_id,_type}[0],
      *[_id == ^.documentId]{_id,_type}[0]
    )
  }  
`

export const workflowListItems = [
  S.listItem()
    .title('Assigned to me')
    .icon(FiTag)
    .id('me')
    .child(() => {
      return userDatastore.me.pipe(
        filter(Boolean),
        switchMap(user => {
          return getDocumentMutations$(WORKFLOW_DOCUMENTS_FILTER, {
            type: 'workflow.metadata',
            userId: user.id
          }).pipe(
            switchMap(() => {
              return getDocumentQuery$(WORKFLOW_DOCUMENTS_QUERY, {
                type: 'workflow.metadata',
                userId: user.id
              })
            })
          )
        }),
        map(docs => {
          return S.list()
            .title(docs.length ? 'Assigned to me' : 'No assigments')
            .id('me')
            .items(docs.map(item => S.documentListItem().id(item._id).schemaType(item._type)))
        })
      )
    })
]
