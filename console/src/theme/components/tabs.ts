const baseStyle = {
  tab: {
    fontWeight: 'medium',
    color: 'muted',
    _focus: {
      boxShadow: 'none',
    },
    _focusVisible: {
      boxShadow: 'base',
    },
  },
}

const variants = {
  line: {
    tab: {
      _selected: {
        color: 'accent',
        borderColor: 'accent',
        fontWeight: 'bold',
      },
      _active: {
        bg: 'transparent',
        fontWeight: 'bold',
      },
    },
  },
  enclosed: {
    tab: {
      _selected: {
        color: 'accent',
      },
    },
  },
}

const sizes = {
  md: {
    tab: {
      fontSize: 'sm',
    },
  },
}

const tabs = { baseStyle, variants, sizes }

export default tabs