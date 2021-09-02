import PropTypes from 'prop-types'
import React from 'react'
import {Button} from '@sanity/ui'
import {EditIcon} from '@sanity/icons'

import {useIntentLink} from '../../lib/router'

export default function EditButton({id, type}) {
  const handleClick = useIntentLink('edit', {id, type}).onClick

  return (
    <Button
      onClick={handleClick}
      mode="ghost"
      fontSize={1}
      padding={2}
      tabIndex={-1}
      icon={EditIcon}
      text="Edit"
    />
  )
}

EditButton.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}
