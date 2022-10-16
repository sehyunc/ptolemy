import { Box, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

interface RowProps {
  address: string
  discord: number
  chainName: string
  credit: number
  reddit: number
}

const Row: React.FC<RowProps> = ({
  address,
  discord,
  chainName,
  credit,
  reddit,
}) => {
  return (
    <Link to={`/validator/${address}`}>
      <Box
        alignItems="center"
        backgroundColor="#0e0e10"
        borderBottom="1px solid #1f1f23"
        borderLeft="1px solid #1f1f23"
        borderRight="1px solid #1f1f23"
        cursor="pointer"
        display="flex"
        height="72px"
        px={12}
        py={10}
        style={{ fontWeight: "bold" }}
        _hover={{ opacity: 0.7 }}
      >
        <Box alignItems="center" display="flex" flex={2} justifyContent="left">
          <Text>{address}</Text>
        </Box>
        <Box alignItems="center" display="flex" flex={1} justifyContent="left">
          <Text>{chainName}</Text>
        </Box>
        <Box alignItems="center" display="flex" flex={1} justifyContent="right">
          <Text>{credit}</Text>
        </Box>
        <Box alignItems="center" display="flex" flex={1} justifyContent="right">
          <Text>{discord}</Text>
        </Box>
        <Box alignItems="center" display="flex" flex={1} justifyContent="right">
          <Text>{reddit}</Text>
        </Box>
      </Box>
    </Link>
  )
}

export default Row
