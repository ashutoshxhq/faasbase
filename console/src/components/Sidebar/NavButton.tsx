import { As, Button, ButtonProps, HStack, Icon, Text, Tooltip } from '@chakra-ui/react'
import React from 'react'

interface NavButtonProps extends ButtonProps {
  icon: As
  label: string
  to?: string
  target?: string
}

export const NavButton = (props: NavButtonProps) => {
  const { icon, label, ...buttonProps } = props
  return (
    <Tooltip label={label} placement='right'>
      <Button variant="ghost" justifyContent="center" {...buttonProps} _hover={{ backgroundColor: "whiteAlpha.200" }} _active={{ backgroundColor: "whiteAlpha.200" }} w={12} h={12} borderRadius={"8px"} p={0} mt={4}>
          <Icon as={icon} boxSize="5" color="subtle" />
      </Button>
    </Tooltip>

  )
}