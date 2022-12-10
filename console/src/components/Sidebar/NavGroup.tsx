import { Box, Stack, Text } from '@chakra-ui/react'
import * as React from 'react'

interface NavGroupProps {
  label: string
  children: React.ReactNode
}

export const NavGroup = (props: NavGroupProps) => {
  const { label, children } = props
  return (
    <Box>
      <Text
        px="2"
        fontSize="10px"
        fontWeight="semibold"
        textTransform="uppercase"
        letterSpacing="widest"
        color="subtle"
        my="2"
      >
        {label}
      </Text>
      <Stack justifyContent={'center'} alignItems={'center'} spacing="1">
        {children}
      </Stack>
    </Box>
  )
}
