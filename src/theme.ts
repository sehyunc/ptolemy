import { extendTheme } from "@chakra-ui/react"

// Generate color scheme palette: https://smart-swatch.netlify.app/
const theme = extendTheme({
  config: {
    useSystemColorMode: true,
    initialColorMode: "dark",
  },
  styles: {
    global: () => ({
      body: {
        bg: "#000",
      },
    }),
  },
})

export default theme
