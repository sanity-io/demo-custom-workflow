import React from 'react'
import {Avatar} from './avatar'

// Import styles
import styles from './userCard.css'

export function UserCard(props) {
  const {data} = props

  return (
    <div className={styles.root}>
      <div className={styles.avatar}>
        <Avatar userId={data.id} />
      </div>
      <div className={styles.displayName}>
        {data.displayName}
        {data.isCurrentUser && <> (me)</>}
      </div>
    </div>
  )
}
