import { mode, StyleFunctionProps, transparentize } from '@chakra-ui/theme-tools'

const variants = {
  outline: (props: StyleFunctionProps) => ({
    borderRadius: 'lg',
    bg: mode('white', 'transparent')(props),
    border: "solid 1.5px",
    _focus: {
      borderColor: mode('brand.500', 'orange.500')(props),
      boxShadow: "none",
    },
  }),
}

const textarea = {
  variants,
}

export default textarea
