import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools'

export default {
  global: (props: StyleFunctionProps) => ({
    body: {
      color: 'default',
      bg: 'bg-canvas',
    },
    '*::placeholder': {
      opacity: 1,
      color: 'subtle',
    },
    '*, *::before, &::after': {
      borderColor: mode('#424242', '#424242')(props),
    },
  }),
}
