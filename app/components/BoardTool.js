import React from 'react'
import {useDrag} from 'react-use-gesture'
import {Flex, Card, Box, Stack, Grid, Spinner, Label, Button} from '@sanity/ui'

import {useWorkflowMetadataList} from '../lib/workflow'
import {states, types as workflowTypes} from '../config/workflow'
import {useProjectUsers} from '../lib/user'
import {DocumentCard} from './DocumentCard'

import styles from './BoardTool.css'

function filterItemsByState(items, state) {
  return items.filter(item => item.state === state)
}

export function BoardTool() {
  const [dragData, setDragData] = React.useState(null)
  const [targetState, setTargetState] = React.useState(null)

  const userList = useProjectUsers() || []

  const metadataList = useWorkflowMetadataList(workflowTypes)
  const items = metadataList && metadataList.data
  const documentIds = metadataList.documentIds

  const metadataDocumentIds = metadataList.data.map(d => d.documentId)
  const documentIdsWithoutMetadata = documentIds.filter(id => !metadataDocumentIds.includes(id))

  const handleColumnMouseEnter = columnId => {
    if (dragData) {
      setTargetState(columnId)
    }
  }

  const bindDrag = useDrag(({args, down, xy, movement}) => {
    const [metadata, revisionId] = args

    // Card distance from initial location
    const [x, y] = movement

    // Cursor travel distance
    const [cursorX] = xy

    const columnWidth = window.innerWidth / states.length
    const currentColumn = parseInt(cursorX / columnWidth, 10)
    const newTargetState = states[currentColumn]?.id ?? ``

    if (targetState !== newTargetState) {
      setTargetState(newTargetState)
    }

    const documentId = metadata.documentId

    if (down) {
      setDragData({
        documentId,
        x,
        y,
        state: metadata.state
      })
    } else {
      if (newTargetState && metadata.state !== newTargetState) {
        metadataList.move(documentId, revisionId, newTargetState)
      }

      setDragData(null)
      setTargetState(null)
    }
  })

  if (items) {
    return (
      <div style={{height: `100%`}}>
        {documentIdsWithoutMetadata.length > 0 && (
          <Box paddingY={5} paddingX={3}>
            <Card shadow={1} padding={4} style={{textAlign: 'center'}}>
              <Button
                tone="primary"
                onClick={() => metadataList.importDocuments(documentIdsWithoutMetadata)}
              >
                Import {documentIdsWithoutMetadata.length}{' '}
                {documentIdsWithoutMetadata.length === 1 ? `Document` : `Documents`}
              </Button>
            </Card>
          </Box>
        )}
        <Grid style={{height: `100%`}} columns={states.length}>
          {states.map(state => (
            <div
              key={state.id}
              className={
                targetState && targetState === state.id
                  ? styles.columnActive
                  : styles.columnInactive
              }
              onMouseEnter={() => handleColumnMouseEnter(state.id)}
            >
              <Box className={styles.column}>
                <Stack>
                  <Box
                    paddingX={3}
                    paddingTop={4}
                    paddingBottom={2}
                    style={{pointerEvents: `none`}}
                  >
                    <Label>{state.title}</Label>
                  </Box>
                  <Grid columns={1} gap={3} padding={3}>
                    {items.length === 0 && (
                      <Flex style={{height: `100%`}} align="center" justify="center">
                        <Spinner muted />
                      </Flex>
                    )}
                    {items.length > 0 &&
                      filterItemsByState(items, state.id).map(item => (
                        <div key={item._id}>
                          <DocumentCard
                            bindDrag={bindDrag}
                            dragData={dragData}
                            metadata={item}
                            userList={userList}
                            onAssigneeAdd={userId =>
                              metadataList.addAssignee(item.documentId, userId)
                            }
                            onAssigneeRemove={userId =>
                              metadataList.removeAssignee(item.documentId, userId)
                            }
                            onAssigneesClear={() => metadataList.clearAssignees(item.documentId)}
                          />
                        </div>
                      ))}
                  </Grid>
                </Stack>
              </Box>
            </div>
          ))}
        </Grid>
      </div>
    )
  }

  return <div>BoardTool</div>
}
