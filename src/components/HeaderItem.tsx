import React, { useMemo } from "react"
import { Box, Icon, Text } from "@chakra-ui/react"

interface Props {
  align?: "left" | "right"
  flex?: number
  title: string
}

const Header = ({ align = "left", flex = 1, title }: Props) => {
  const justifyContent = align === "left" ? "flex-start" : "flex-end"

  return (
    <Box
      alignItems="center"
      cursor="pointer"
      display="flex"
      flex={flex}
      // opacity="0.55"
      style={{ justifyContent }}
      textAlign={align}
      // _hover={{
      // 	opacity: "1",
      // }}
    >
      <Text textAlign={align} fontWeight="semibold">
        {title}
      </Text>
    </Box>
  )
}

export default Header
