import { extendTheme } from '@chakra-ui/react'
import 'focus-visible/dist/focus-visible'
import * as components from './components'
import * as foundations from './foundations'

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

export const theme: Record<string, any> = extendTheme({
  config,
  ...foundations,
  components: { ...components},
})
