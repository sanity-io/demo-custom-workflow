import React from 'react'
import Button from 'part:@sanity/components/buttons/default'
import {useDrag} from 'react-use-gesture'
import {states, types as workflowTypes} from '../config/workflow'
import {useWorkflowMetadataList} from '../lib/workflow'
import {DocumentCard} from './documentCard'

// Import styles
import styles from './boardTool.css'

function filterItemsByState(items, state) {
  return items.filter(item => item.state === state)
}

export function BoardTool() {
  const [dragData, setDragData] = React.useState(null)
  const [targetState, setTargetState] = React.useState(null)
  const metadataList = useWorkflowMetadataList(workflowTypes)
  const items = metadataList && metadataList.data
  const documentIds = metadataList.documentIds

  const metadataDocumentIds = metadataList.data.map(d => d.documentId)
  const documentIdsWithoutMetadata = documentIds.filter(id => !metadataDocumentIds.includes(id))

  const bindDrag = useDrag(({args, down, movement}) => {
    const [metadata, typeName, revisionId] = args
    const [x, y] = movement
    const documentId = metadata.documentId

    if (down) {
      setDragData({
        documentId,
        down,
        x,
        y,
        state: metadata.state
      })
    } else {
      if (targetState && metadata.state !== targetState) {
        metadataList.move(documentId, revisionId, targetState)
      }

      setDragData(null)
      setTargetState(null)
    }
  })

  const handleColumnMouseEnter = columnId => {
    if (dragData) {
      setTargetState(columnId)
    }
  }

  if (items) {
    return (
      <div className={styles.root}>
        {documentIdsWithoutMetadata.length > 0 && (
          <div className={styles.importButtonWrapper}>
            <Button
              color="primary"
              onClick={() => metadataList.importDocuments(documentIdsWithoutMetadata)}
            >
              Import {documentIdsWithoutMetadata.length} documents
            </Button>
          </div>
        )}
        <div className={styles.columns}>
          {states.map(state => (
            <div
              className={styles.column}
              key={state.id}
              onMouseEnter={() => handleColumnMouseEnter(state.id)}
            >
              <div className={styles.columnHeader}>
                <h3>{state.title}</h3>
              </div>

              <div className={styles.columnBody}>
                {filterItemsByState(items, state.id).map(item => (
                  <div key={item._id}>
                    <DocumentCard
                      bindDrag={bindDrag}
                      dragData={dragData}
                      metadata={item}
                      onAssigneeAdd={userId => metadataList.addAssignee(item.documentId, userId)}
                      onAssigneeRemove={userId =>
                        metadataList.removeAssignee(item.documentId, userId)
                      }
                      onAssigneesClear={() => metadataList.clearAssignees(item.documentId)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return <div>BoardTool</div>
}
