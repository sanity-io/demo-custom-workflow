import EditIcon from 'part:@sanity/base/edit-icon'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import PopOverDialog from 'part:@sanity/components/dialogs/popover'
import React, {useState} from 'react'
import { MdAdd as AddIcon } from "react-icons/md";
import {useLatestDocumentPreview} from '../lib/document'
import {useIntentLink} from '../lib/router'
import {AvatarGroup} from './avatarGroup'
import {UserIdArrayInput} from './userIdArrayInput'

// Import styles
import styles from './documentCard.css'

export function DocumentCard(props) {
  const {bindDrag, dragData, onAssigneeAdd, onAssigneeRemove, onAssigneesClear} = props
  const {assignees, documentId, reference} = props.metadata
  const preview = useLatestDocumentPreview(documentId, reference._type)
  const [showUserInput, setShowUserInput] = useState(false)
  const editDocumentLink = useIntentLink('edit', {id: documentId, type: reference._type})

  function handleShowUserInput() {
    setShowUserInput(true)
  }

  function handleAssigneesFormCloseClick() {
    setShowUserInput(false)
  }

  function handleEditAssigneesClick() {
    setShowUserInput(true)
  }

  // Build inline style
  const inlineStyle = {}
  if (dragData && dragData.documentId === documentId) {
    inlineStyle.transform = `translate3d(${dragData.x}px, ${dragData.y}px, 0)`
    inlineStyle.position = 'relative'
    inlineStyle.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.25)'
    inlineStyle.zIndex = 11
    inlineStyle.pointerEvents = 'none'
  }

  return (
    <div className={styles.root} style={inlineStyle}>
      <div className={styles.content}>
        <div
          {...bindDrag(props.metadata, reference._type, preview && preview._rev)}
          className={styles.preview}
        >
          <SanityDefaultPreview value={preview} />
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          {(!assignees || assignees.length === 0) && (
            <button className={styles.button} onClick={handleShowUserInput} type="button">
              <div tabIndex={-1}>
                <span className={styles.buttonIcon}>
                  <AddIcon />
                </span>
                <span className={styles.buttonLabel}>Add assignees</span>
              </div>
            </button>
          )}

          {assignees && (
            <button
              className={styles.editAssigneesButton}
              onClick={handleEditAssigneesClick}
              type="button"
              title="Edit assignees"
            >
              <AvatarGroup userIds={assignees} />
            </button>
          )}

          {showUserInput && (
            <PopOverDialog
              onClickOutside={handleAssigneesFormCloseClick}
              padding="none"
              placement="bottom"
              useOverlay={false}
              hasAnimation
            >
              <UserIdArrayInput
                onAdd={onAssigneeAdd}
                onClear={onAssigneesClear}
                onRemove={onAssigneeRemove}
                value={assignees || []}
              />
            </PopOverDialog>
          )}
        </div>

        <div className={styles.footerRight}>
          <a
            className={styles.button}
            href={editDocumentLink.href}
            onClick={editDocumentLink.onClick}
          >
            <div tabIndex={-1}>
              <span className={styles.buttonIcon}>
                <EditIcon />
              </span>
              <span className={styles.buttonLabel}>Edit document</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
