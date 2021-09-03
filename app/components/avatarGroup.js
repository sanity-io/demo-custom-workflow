import PropTypes from 'prop-types'
import React, {useMemo} from 'react'
import {UserAvatar} from '@sanity/base/components'
import {Box, Flex, Text} from '@sanity/ui'

export function AvatarGroup({userIds}) {
  const max = 3
  const len = userIds?.length
  const visibleUsers = useMemo(() => userIds.slice(0, max), [userIds])

  return (
    <Flex align="center">
      {visibleUsers.map(userId => (
        <Box key={userId} style={{marginRight: -5}}>
          <UserAvatar userId={userId} />
        </Box>
      ))}
      {len > max && (
        <Box paddingLeft={2}>
          <Text size={1}>+{len - max}</Text>
        </Box>
      )}
    </Flex>
  )
}

AvatarGroup.propTypes = {
  userIds: PropTypes.arrayOf(PropTypes.string).isRequired
}
