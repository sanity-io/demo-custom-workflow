import {omit} from 'lodash'
import client from 'part:@sanity/base/client'
import schema from 'part:@sanity/base/schema'

function fetchSnapshots(documentId) {
  return client.fetch('{"published":*[_id==$publishedId][0],"draft":*[_id==$draftId][0]}', {
    draftId: `drafts.${documentId}`,
    publishedId: documentId
  })
}

export async function publish(documentId, revisionId) {
  if (!revisionId) throw new Error(`missing revision ID for ${documentId}`)

  const snapshots = await fetchSnapshots(documentId)
  const idPair = {draftId: `drafts.${documentId}`, publishedId: documentId}
  const latest = snapshots.draft || snapshots.published

  if (!snapshots.draft) {
    throw new Error(`no draft to publish: ${documentId}`)
  }

  if (!latest) throw new Error(`document not found: ${documentId}`)

  const typeName = latest._type
  const type = schema.get(typeName)

  if (!type) throw new Error(`document type not found: ${typeName}`)
  if (type.liveEdit) throw new Error(`cannot publish live edit documents: ${typeName}`)

  const tx = client.transaction()

  if (!snapshots.published) {
    // If the document has not been published, we want to create it - if it suddenly exists
    // before being created, we don't want to overwrite if, instead we want to yield an error
    tx.create({
      ...omit(snapshots.draft, '_updatedAt'),
      _id: idPair.publishedId
    })
  } else {
    // If it exists already, we only want to update it if the revision on the remote server
    // matches what our local state thinks it's at
    tx.patch(idPair.publishedId, {
      // Hack until other mutations support revision locking
      unset: ['_revision_lock_pseudo_field_'],
      ifRevisionID: revisionId
    }).createOrReplace({
      ...omit(snapshots.draft, '_updatedAt'),
      _id: idPair.publishedId
    })
  }

  tx.delete(idPair.draftId)

  return tx.commit()
}

// TODO: pass `revisionId` as argument
export async function unpublish(documentId, revisionId) {
  if (!revisionId) throw new Error(`missing revision ID for ${documentId}`)

  const snapshots = await fetchSnapshots(documentId)
  const idPair = {draftId: `drafts.${documentId}`, publishedId: documentId}
  const latest = snapshots.draft || snapshots.published

  if (!latest) throw new Error(`document not found: ${documentId}`)

  const typeName = latest._type
  const type = schema.get(typeName)

  if (!type) throw new Error(`document type not found: ${typeName}`)
  if (type.liveEdit) throw new Error(`cannot unpublish live edit documents: ${typeName}`)

  let tx = client.observable.transaction().delete(idPair.publishedId)

  if (snapshots.published) {
    tx = tx.createIfNotExists({
      ...omit(snapshots.published, '_updatedAt'),
      _id: idPair.draftId
    })
  }

  return tx.commit()
}
