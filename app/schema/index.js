import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

// Import workflow types
import workflowMetadata from './workflow/metadata'

// Import custom types
import author from './author'
import post from './post'
import release from './release'

export default createSchema({
  name: 'demo-review-workflow',
  types: schemaTypes.concat([author, post, release, workflowMetadata])
})
