import {useDocumentOperation} from '@sanity/react-hooks'

// @todo
export function discardChangesAction(props) {
  const ops = useDocumentOperation(props.id, props.type)

  const onHandle = async () => {
    ops.discardChanges.execute()
    props.onComplete()
  }

  return {
    disabled: ops.discardChanges.disabled,
    label: 'Discard changes',
    onHandle
  }
}
