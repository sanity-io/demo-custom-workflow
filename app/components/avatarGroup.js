import React from 'react'
import {Avatar} from './avatar'

// Import styles
import styles from './avatarGroup.css'

export function AvatarGroup(props) {
  const {userIds} = props
  const len = userIds.length
  const visibleIds = userIds.slice(0, 3)

  return (
    <div className={styles.root}>
      {visibleIds.map((userId, userIdIdx) => (
        <div key={userId} style={{zIndex: len - userIdIdx + 1}}>
          <Avatar userId={userId} />
        </div>
      ))}
      {len > 3 && <div className={styles.plus}>+{len - 3}</div>}
    </div>
  )
}
