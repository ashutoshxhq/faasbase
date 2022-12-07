import { Avatar, Box, HStack, Text } from '@chakra-ui/react'
import * as React from 'react'

interface UserProfileProps {
  name: string
  email: string
}

export const UserProfile = (props: UserProfileProps) => {
  const { name, email } = props
  return (
    <Box width={"100%"} display="flex" justifyContent={"center"} alignItems={"center"}>
      <Avatar name={name} size="sm" />
    </Box>
  )
}