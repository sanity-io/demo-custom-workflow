/* eslint-disable react/prop-types */
import {Box, Button, Card, Flex, Menu, MenuButton, Stack} from '@sanity/ui'
import {AddIcon, DragHandleIcon} from '@sanity/icons'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import React, {useMemo} from 'react'
import {useLatestDocumentPreview} from '../../lib/document'

import {AvatarGroup} from '../AvatarGroup'
import UserAssignmentMenu from '../UserAssignmentMenu'
import {useProjectUsers} from '../../lib/user'

import EditButton from './EditButton'

export function DocumentCard(props) {
  const {bindDrag, dragData, onAssigneeAdd, onAssigneeRemove, onAssigneesClear} = props
  const {assignees, documentId, reference} = props.metadata
  const preview = useLatestDocumentPreview(documentId, reference._type)
  const userList = useProjectUsers() || []

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
              <MenuButton
                id={`${documentId}-user-assignment`}
                button={
                  !assignees || assignees.length === 0 ? (
                    <Button
                      fontSize={1}
                      padding={2}
                      tabIndex={-1}
                      icon={AddIcon}
                      text="Assign"
                      tone="positive"
                    />
                  ) : (
                    <Button padding={0} mode="bleed" style={{width: `100%`}}>
                      <AvatarGroup userIds={assignees} />
                    </Button>
                  )
                }
                menu={
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
                placement="right"
                portal
              />

              <EditButton id={documentId} type={reference._type} />
            </Flex>
          </Card>
        </Stack>
      </Card>
    </div>
  )
}
