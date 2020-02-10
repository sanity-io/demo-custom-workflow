import TextInput from 'part:@sanity/components/textinputs/default'
import CheckIcon from 'part:@sanity/base/check-icon'
import React from 'react'
import {useProjectUsers} from '../lib/user'
import {UserCard} from './userCard'

// Import styles
import styles from './userIdArrayInput.css'

function searchUsers(users, searchString) {
  return users.filter(user => {
    const givenName = (user.givenName || '').toLowerCase()
    const middleName = (user.middleName || '').toLowerCase()
    const familyName = (user.familyName || '').toLowerCase()

    if (givenName.startsWith(searchString)) return true
    if (middleName.startsWith(searchString)) return true
    if (familyName.startsWith(searchString)) return true

    return false
  })
}

// eslint-disable-next-line complexity
export const UserIdArrayInput = React.forwardRef((props, focusableRef) => {
  const [searchString, setSearchString] = React.useState('')
  const value = props.value || []
  const userList = useProjectUsers() || []
  const searchResults = searchUsers(userList || [], searchString)

  const me = userList.find(u => u.isCurrentUser)
  const meAssigned = me && value.includes(me.id)

  const handleSearchChange = event => {
    setSearchString(event.target.value)
  }

  const handleCheckboxUpdate = (event, user) => {
    if (event.target.checked) {
      if (props.onAdd) props.onAdd(user.id)
    } else {
      if (props.onRemove) props.onRemove(user.id)
    }
  }

  const handleAssignMyself = () => {
    if (me && props.onAdd) props.onAdd(me.id)
  }

  const handleUnassignMyself = () => {
    if (me && props.onRemove) props.onRemove(me.id)
  }

  const handleClearAssigneesClick = () => {
    if (props.onClear) props.onClear()
  }

  return (
    <div className={styles.root}>
      {meAssigned && (
        <button
          className={styles.menuButton}
          disabled={!me}
          onClick={handleUnassignMyself}
          type="button"
        >
          <div tabIndex={-1}>Unassign myself</div>
        </button>
      )}

      {!meAssigned && (
        <button
          className={styles.menuButton}
          disabled={!me}
          onClick={handleAssignMyself}
          type="button"
        >
          <div tabIndex={-1}>Assign myself</div>
        </button>
      )}

      <button
        className={styles.menuButton}
        disabled={value.length === 0}
        onClick={handleClearAssigneesClick}
        type="button"
      >
        <div tabIndex={-1}>Clear assignees</div>
      </button>

      <div className={styles.search}>
        <TextInput
          onChange={handleSearchChange}
          placeholder="Type to filter members"
          ref={focusableRef}
          value={searchString}
        />
      </div>

      <div className={styles.menuWrapper}>
        <div className={styles.menu}>
          {!searchResults ||
            (searchResults.length === 0 && <div style={{padding: '0.25em 0.5em'}}>No matches</div>)}

          {searchResults &&
            searchResults.map(user => (
              <label className={styles.menuItem} key={user.id}>
                <div className={styles.userOption} tabIndex={-1}>
                  <div className={styles.userCard}>
                    <UserCard data={user} />
                  </div>
                  <div className={styles.userCheckbox}>
                    <input
                      checked={value.indexOf(user.id) > -1}
                      type="checkbox"
                      onChange={event => handleCheckboxUpdate(event, user)}
                    />
                    <div className={styles.userCheckboxIcon}>
                      <CheckIcon />
                    </div>
                  </div>
                </div>
              </label>
            ))}
        </div>
      </div>
    </div>
  )
})
