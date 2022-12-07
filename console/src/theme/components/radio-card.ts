import { mode, StyleFunctionProps, transparentize } from '@chakra-ui/theme-tools'

const baseStyle = (props: StyleFunctionProps) => ({
  borderWidth: '1px',
  borderRadius: 'lg',
  p: '4',
  bg: 'whiteAlpha.200',
  transitionProperty: 'common',
  transitionDuration: 'normal',
  _hover: { borderColor: mode('#303030', '#303030')(props) },
  _checked: {
    borderColor: mode('brand.500', 'brand.200')(props),
    boxShadow: mode(
      `0px 0px 0px 1px ${transparentize(`brand.500`, 1.0)(props.theme)}`,
      `0px 0px 0px 1px ${transparentize(`brand.200`, 1.0)(props.theme)}`,
    )(props),
  },
})

const radioCard = {
  baseStyle,
}

export default radioCard
