import { mode, StyleFunctionProps, transparentize } from '@chakra-ui/theme-tools'

const variants = {
  outline: (props: StyleFunctionProps) => ({
    field: {
      borderRadius: 'lg',
      bg: mode('white', 'transparent')(props),
      border:"solid 1.5px",
      _hover: { borderColor: mode('gray.300', '#424242')(props) },
      _focus: {
        borderColor: mode('brand.500', 'orange.500')(props),
        boxShadow: "none",
      },
    },
    addon: {
      borderRadius: 'lg',
      bg: mode('gray.50', 'gray.700')(props),
    },
  }),
  'outline-on-accent': (props: StyleFunctionProps) => ({
    field: {
      bg: 'white',
      borderRadius: 'lg',
      color: 'gray.900',
      borderWidth: '2px',
      borderColor: 'brand.50',
      _placeholder: {
        color: 'gray.500',
      },
      _hover: {
        borderColor: 'brand.100',
      },
      _focus: {
        borderColor: 'brand.200',
        boxShadow: `0px 0px 0px 1px ${transparentize(`brand.200`, 1.0)(props.theme)}`,
      },
    },
  }),
  filled: (props: StyleFunctionProps) => {
    if (props.colorScheme === 'gray') {
      return {
        field: {
          bg: mode('white', 'gray.800')(props),
          _hover: {
            borderColor: mode('gray.200', 'gray.700')(props),
            bg: mode('white', 'gray.700')(props),
          },
          _focus: {
            borderColor: 'accent',
            bg: mode('white', 'gray.800')(props),
          },
        },
      }
    }
    return {
      field: {
        bg: 'bg-accent-subtle',
        color: 'on-accent',
        _placeholder: {
          color: 'on-accent',
        },
        _hover: {
          borderColor: 'brand.400',
          bg: 'bg-accent-subtle',
        },
        _focus: {
          bg: 'bg-accent-subtle',
          borderColor: 'brand.300',
        },
      },
    }
  },
}

const input = {
  variants,
  defaultProps: {
    colorScheme: 'gray',
  },
}


export default input