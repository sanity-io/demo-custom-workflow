import sanityClient from 'part:@sanity/base/client'
import {merge, Subject} from 'rxjs'
import {filter, map, scan, startWith, switchMap} from 'rxjs/operators'
import {getDocumentMutations$, getDocumentQuery$, publish, unpublish} from '../document'
import {useObservable} from '../utils/use'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

const DOCUMENT_LIST_FILTER = `_type in $workflowTypes`
const DOCUMENT_LIST_QUERY = `* [_type in $workflowTypes] {_id, _type}`

const METADATA_LIST_FILTER = `_type == $type`
const METADATA_LIST_QUERY = `* [_type == $type] {
  _id,
  assignees,
  documentId,
  "reference": coalesce(
    *[_id == "drafts." + ^.documentId] {_type} [0],
    *[_id == ^.documentId] {_type} [0]
  ),
  state
}`

function ensurePublished(documentId, revisionId) {
  publish(documentId, revisionId).catch(err => {
    console.warn('publish failed:', err.message)
  })
}

function ensureDraft(documentId, revisionId) {
  unpublish(documentId, revisionId).catch(err => {
    console.warn('unpublish failed:', err.message)
  })
}

function getPublishedId(id) {
  const parts = id.split('.')
  if (parts.length === 2) return parts[1]
  return parts[0]
}

function metadataListReducer(state, event) {
  if (event.type === 'document.snapshot') {
    const documentIds = event.snapshot
      .map(d => d._id)
      .reduce((acc, id) => {
        const publishedId = getPublishedId(id)
        if (acc.includes(publishedId)) return acc
        return acc.concat([publishedId])
      }, [])

    return {
      ...state,
      documentIds
    }
  }

  if (event.type === 'snapshot') {
    return {...state, data: event.snapshot.filter(d => d.reference)}
  }

  if (event.type === 'move') {
    return {
      ...state,
      data: state.data.map(d => {
        if (d.documentId === event.documentId) {
          return {...d, state: event.nextState}
        }
        return d
      })
    }
  }

  if (event.type === 'addAssignee') {
    return {
      ...state,
      data: state.data.map(d => {
        if (d.documentId === event.documentId) {
          const assignees = d.assignees || []

          if (!assignees.includes(event.userId)) {
            assignees.push(event.userId)
          }

          return {...d, assignees}
        }
        return d
      })
    }
  }

  if (event.type === 'clearAssignees') {
    return {
      ...state,
      data: state.data.map(d => {
        if (d.documentId === event.documentId) {
          return {...d, assignees: []}
        }
        return d
      })
    }
  }

  if (event.type === 'removeAssignee') {
    return {
      ...state,
      data: state.data.map(d => {
        if (d.documentId === event.documentId) {
          const assignees = d.assignees || []

          if (assignees.includes(event.userId)) {
            assignees.splice(assignees.indexOf(event.userId), 1)
          }

          return {...d, assignees}
        }
        return d
      })
    }
  }

  return state
}

function getWorkflowMetadataListDataEvent$(workflowTypes) {
  const documentListSnapshotEvent$ = getDocumentQuery$(DOCUMENT_LIST_QUERY, {
    workflowTypes
  }).pipe(map(snapshot => ({type: 'document.snapshot', snapshot, timestamp: 0})))

  const documentListMutationsEvent$ = getDocumentMutations$(DOCUMENT_LIST_FILTER, {
    workflowTypes
  })

  const updatedDocumentListSnapshotEvent$ = documentListMutationsEvent$.pipe(
    filter(mutationEvent => mutationEvent.type !== 'welcome'),
    switchMap(mutationEvent => {
      const timestamp = Date.parse(mutationEvent.timestamp)

      if (isNaN(timestamp)) {
        console.warn('`timestamp` is NaN from mutationEvent', mutationEvent)
      }

      return getDocumentQuery$(DOCUMENT_LIST_QUERY, {
        workflowTypes
      }).pipe(
        map(snapshot => ({
          type: 'document.snapshot',
          snapshot,
          timestamp
        }))
      )
    })
  )

  const metadataListSnapshotEvent$ = getDocumentQuery$(METADATA_LIST_QUERY, {
    type: 'workflow.metadata'
  }).pipe(map(snapshot => ({type: 'snapshot', snapshot, timestamp: 0})))

  const metadataListMutationsEvent$ = getDocumentMutations$(METADATA_LIST_FILTER, {
    type: 'workflow.metadata'
  })

  const updatedMetadataListSnapshotEvent$ = metadataListMutationsEvent$.pipe(
    filter(mutationEvent => mutationEvent.type !== 'welcome'),
    switchMap(mutationEvent => {
      const timestamp = Date.parse(mutationEvent.timestamp)

      if (isNaN(timestamp)) {
        console.warn('`timestamp` is NaN from mutationEvent', mutationEvent)
      }

      return getDocumentQuery$(METADATA_LIST_QUERY, {type: 'workflow.metadata'}).pipe(
        map(snapshot => ({
          type: 'snapshot',
          snapshot,
          timestamp
        }))
      )
    })
  )

  return merge(
    documentListSnapshotEvent$,
    updatedDocumentListSnapshotEvent$,
    metadataListSnapshotEvent$,
    updatedMetadataListSnapshotEvent$
  )
}

function getWorkflowMetadataListState$(workflowTypes) {
  const methodSubject = new Subject()
  const initialState = {data: [], documentIds: []}
  const dataEvent$ = getWorkflowMetadataListDataEvent$(workflowTypes)
  const methodEvent$ = methodSubject.asObservable()
  const events$ = merge(dataEvent$, methodEvent$).pipe(
    scan((events, event) => {
      const sortedEvents = events.concat(event)
      sortedEvents.sort((a, b) => a.timestamp - b.timestamp)
      return sortedEvents
    }, []),
    startWith([])
  )

  const state$ = events$.pipe(
    map(events => events.reduce(metadataListReducer, initialState)),
    startWith(initialState),
    map(state => ({
      ...state,
      addAssignee,
      clearAssignees,
      importDocuments,
      move,
      removeAssignee
    }))
  )

  return {
    initialState: {
      ...initialState,
      addAssignee,
      clearAssignees,
      importDocuments,
      move,
      removeAssignee
    },
    state$
  }

  function addAssignee(documentId, userId) {
    methodSubject.next({type: 'addAssignee', documentId, userId, timestamp: Date.now()})

    // TODO: await before handling event in the reducer?
    client
      .patch(`workflow-metadata.${documentId}`)
      .setIfMissing({assignees: []})
      .insert('after', 'assignees[-1]', [userId])
      .commit()
  }

  function clearAssignees(documentId) {
    methodSubject.next({type: 'clearAssignees', documentId, timestamp: Date.now()})

    // TODO: await before handling event in the reducer?
    client.patch(`workflow-metadata.${documentId}`).unset(['assignees']).commit()
  }

  function importDocuments(documentIds) {
    // TODO: optimistically update?

    const tx = documentIds.reduce((item, documentId) => {
      return item.createOrReplace({
        _id: `workflow-metadata.${documentId}`,
        _type: 'workflow.metadata',
        state: 'draft',
        documentId
      })
    }, client.transaction())

    tx.commit()
  }

  function move(documentId, revisionId, nextState) {
    methodSubject.next({type: 'move', documentId, revisionId, nextState, timestamp: Date.now()})

    // TODO: await before handling event in the reducer?
    client.patch(`workflow-metadata.${documentId}`).set({state: nextState}).commit()

    if (nextState === 'published') {
      ensurePublished(documentId, revisionId)
    } else {
      ensureDraft(documentId, revisionId)
    }
  }

  function removeAssignee(documentId, userId) {
    methodSubject.next({type: 'removeAssignee', documentId, userId, timestamp: Date.now()})

    // TODO: await before handling event in the reducer?
    client
      .patch(`workflow-metadata.${documentId}`)
      .unset([`assignees[@ == ${JSON.stringify(userId)}]`])
      .commit()
  }
}

export function useWorkflowMetadataList(workflowTypes) {
  const {initialState, state$} = getWorkflowMetadataListState$(workflowTypes)

  return useObservable(state$, initialState, workflowTypes)
}
