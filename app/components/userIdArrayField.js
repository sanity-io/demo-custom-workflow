import FormField from 'part:@sanity/components/formfields/default'
import {insert, PatchEvent, setIfMissing, unset} from 'part:@sanity/form-builder/patch-event'
import React from 'react'
import {UserIdArrayInput} from './userIdArrayInput'

export const UserIdArrayField = React.forwardRef((props, focusableRef) => {
  const {type: schemaType, value} = props

  const inputProps = {
    onAdd(userId) {
      const position = 'after'
      const atIndex = value ? value.length - 1 : -1
      props.onChange(
        PatchEvent.from([
          // Create array if not already set
          setIfMissing([]),
          // Insert item at end of array (append)
          insert([userId], position, [atIndex])
        ])
      )
    },

    // TODO:
    // onBlur: props.onBlur,
    // onFocus: props.onFocus,

    onClear() {
      props.onChange(PatchEvent.from([unset()]))
    },

    onRemove(userId) {
      const index = value.indexOf(userId)
      if (index === -1) return
      props.onChange(PatchEvent.from([unset([index])]))
    }
  }

  return (
    <FormField description={schemaType.description} label={schemaType.title}>
      <UserIdArrayInput {...inputProps} props={props} ref={focusableRef} value={value} />
    </FormField>
  )
})
