const baseStyle = {
  track: {
    borderRadius: 'base',
  },
}

const variants = {
  solid: {
    track: {
      bg: 'bg-muted',
    },
  },
  'on-accent': {
    track: {
      bg: 'transparent',
    },
    filledTrack: {
      bg: 'brand.50',
    },
  },
}

const defaultProps = {
  colorScheme: 'brand',
  variant: 'solid',
}

const progress = {
  variants,
  baseStyle,
  defaultProps,
}


export default progress