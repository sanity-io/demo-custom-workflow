import PropTypes from 'prop-types'
import React from 'react'
import {Button, Menu, Card} from '@sanity/ui'

import {useProjectUsers} from '../lib/user'
import UserAssignmentMenu from './UserAssignmentMenu'

export default function RequestReviewWizard({onSend, metadata}) {
  const [value, setValue] = React.useState(metadata.assignees || [])
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

  const handleSend = () => {
    if (onSend) onSend(value)
  }

  return (
    <>
      <Menu style={{maxHeight: 250}}>
        <UserAssignmentMenu {...inputProps} value={value} userList={userList} />
      </Menu>
      <Card borderTop={1} padding={1} style={{textAlign: 'center'}}>
        <Button
          tone={value.length === 0 ? undefined : 'primary'}
          disabled={value.length === 0}
          onClick={handleSend}
          text="Send request"
          style={{width: `100%`}}
        />
      </Card>
    </>
  )
}

RequestReviewWizard.propTypes = {
  metadata: PropTypes.shape({
    assignees: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onSend: PropTypes.func.isRequired
}
