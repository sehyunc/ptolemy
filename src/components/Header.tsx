import { Box } from "@chakra-ui/react"

import HeaderItem from "./HeaderItem"

const Header: React.FC = () => {
  return (
    <Box
      alignItems="center"
      backgroundColor="#0e0e10"
      border="1px solid #1f1f23"
      borderTopLeftRadius="10px"
      borderTopRightRadius="10px"
      display="flex"
      height="44px"
      px={12}
      py={8}
      width="100%"
    >
      <HeaderItem flex={2} title="Name" />
      <HeaderItem title="Chain" />
      <HeaderItem title="DID" />
      <HeaderItem align="right" title="Reputation" />
      <HeaderItem align="right" title="Discord" />
      <HeaderItem align="right" title="Reddit" />
    </Box>
  )
}

export default Header
