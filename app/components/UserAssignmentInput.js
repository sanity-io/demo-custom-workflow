import PropTypes from 'prop-types'
import React from 'react'

import {useProjectUsers} from '../lib/user'
import UserAssignmentMenu from './UserAssignmentMenu'

export default function UserAssignmentInput(props) {
  const [value, setValue] = React.useState(props.value ?? [])
  const userList = useProjectUsers() || []

  const inputProps = {
    onAdd(userId) {
      const idx = value.indexOf(userId)
      if (idx > -1) return
      setValue(value.concat([userId]))
    },

    onClear() {
      setValue([])
    },

    onRemove(userId) {
      const idx = value.indexOf(userId)
      if (idx === -1) return
      const newValue = value.slice(0)
      newValue.splice(idx, 1)
      setValue(newValue)
    }
  }

  return <UserAssignmentMenu truncate={false} {...inputProps} value={value} userList={userList} />
}

UserAssignmentInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string).isRequired
}
