import client from 'part:@sanity/base/client'

client
  .fetch(`* [_type == "workflow.metadata"]`)
  .then(docs => docs.reduce((acc, doc) => acc.delete(doc._id), client.transaction()).commit())
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
