import React from 'react'
import {useUser} from '../lib/user'

// Import styles
import styles from './avatar.css'

export function Avatar(props) {
  const {userId} = props
  const user = useUser(userId)

  if (!user) return <div className={styles.root} />

  return (
    <div className={styles.root}>
      {user.imageUrl && (
        <div className={styles.image}>
          <img src={user.imageUrl} alt={user.displayName} />
        </div>
      )}

      {!user.imageUrl && (
        <div className={styles.initials}>
          {user.givenName && user.givenName.substr(0, 1)}
          {user.familyName && user.familyName.substr(0, 1)}
        </div>
      )}
    </div>
  )
}
