import {useDocumentOperation} from '@sanity/react-hooks'
import {useEffect} from 'react'
import {inferMetadataState, useWorkflowMetadata} from '../../lib/workflow'

export function SyncAction(props) {
  const metadata = useWorkflowMetadata(props.id, inferMetadataState(props))
  const ops = useDocumentOperation(props.id, props.type)
  const {state} = metadata.data
  const isDraft = Boolean(props.draft)
  const isPublished = Boolean(props.published)
  const isLoaded = isDraft || isPublished

  useEffect(() => {
    if (isLoaded) {
      if (state === 'published' && !props.published) {
        if (!ops.publish.disabled) ops.publish.execute()
      }

      if (state !== 'published' && !props.draft) {
        if (!ops.unpublish.disabled) ops.unpublish.execute()
      }
    }
  }, [isLoaded])

  return null
}
