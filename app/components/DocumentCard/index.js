/* eslint-disable react/prop-types */
import {Button, Card, Flex, Menu, Popover, Stack, useClickOutside} from '@sanity/ui'
import {AddIcon, DragHandleIcon} from '@sanity/icons'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import React, {useState, useMemo} from 'react'
import {useLatestDocumentPreview} from '../../lib/document'

import {AvatarGroup} from '../AvatarGroup'
import UserAssignmentMenu from '../UserAssignmentMenu'
import EditButton from './EditButton'

export function DocumentCard(props) {
  const {userList, bindDrag, dragData, onAssigneeAdd, onAssigneeRemove, onAssigneesClear} = props
  const {assignees, documentId, reference} = props.metadata
  const preview = useLatestDocumentPreview(documentId, reference._type)

  const isBeingDragged = useMemo(() => dragData?.documentId === documentId, [dragData, documentId])

  const inlineStyle = isBeingDragged
    ? {
        transform: `translate3d(${dragData.x}px, ${dragData.y}px, 0)`,
        rotate: `-10deg !important`,
        position: 'relative',
        zIndex: 11,
        userSelect: 'none'
      }
    : {}

  // Open/close handler
  const [popoverRef, setPopoverRef] = useState(null)
  const [openId, setOpenId] = useState(``)

  useClickOutside(() => setOpenId(``), [popoverRef])

  const handleKeyDown = React.useCallback(e => {
    if (e.key === 'Escape') {
      setOpenId(``)
    }
  }, [])

  return (
    <div style={inlineStyle}>
      <Card
        radius={2}
        shadow={isBeingDragged ? 3 : 1}
        tone={isBeingDragged ? 'positive' : 'default'}
      >
        <Stack>
          <div
            {...bindDrag(props.metadata, reference._type, preview && preview._rev)}
            style={{cursor: isBeingDragged ? 'grabbing' : 'grab'}}
          >
            <Card
              borderBottom={1}
              radius={2}
              padding={3}
              paddingLeft={2}
              tone={isBeingDragged ? 'positive' : 'default'}
              style={{pointerEvents: 'none'}}
            >
              <Flex align="center" justify="space-between" gap={1}>
                <SanityDefaultPreview value={preview} />
                <DragHandleIcon style={{flexShrink: 0}} />
              </Flex>
            </Card>
          </div>

          <Card padding={2} radius={2}>
            <Flex align="center" justify="space-between" gap={1}>
              <Popover
                ref={setPopoverRef}
                onKeyDown={handleKeyDown}
                content={
                  <Menu style={{maxHeight: 250}}>
                    <UserAssignmentMenu
                      value={assignees || []}
                      userList={userList}
                      onAdd={onAssigneeAdd}
                      onClear={onAssigneesClear}
                      onRemove={onAssigneeRemove}
                    />
                  </Menu>
                }
                portal
                open={openId === documentId}
              >
                {!assignees || assignees.length === 0 ? (
                  <Button
                    onClick={() => setOpenId(documentId)}
                    fontSize={1}
                    padding={2}
                    tabIndex={-1}
                    icon={AddIcon}
                    text="Assign"
                    tone="positive"
                  />
                ) : (
                  <Button
                    onClick={() => setOpenId(documentId)}
                    padding={0}
                    mode="bleed"
                    style={{width: `100%`}}
                  >
                    <AvatarGroup userIds={assignees} />
                  </Button>
                )}
              </Popover>

              <EditButton id={documentId} type={reference._type} />
            </Flex>
          </Card>
        </Stack>
      </Card>
    </div>
  )
}
