import React from 'react'
import {SplitVerticalIcon} from '@sanity/icons'

import {BoardTool} from '../components/BoardTool'
import {RouterProvider} from '../lib/router'

function BoardToolRoot(props) {
  return (
    <RouterProvider>
      <BoardTool {...props} />
    </RouterProvider>
  )
}

export default {
  name: 'workflow',
  title: 'Workflow',
  component: BoardToolRoot,
  icon: SplitVerticalIcon
}
