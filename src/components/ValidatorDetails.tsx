//@ts-nocheck
import { ArrowBackIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useNavigate, useParams } from "react-router-dom"
import data from "../mockData.json"

const ChainDetails = () => {
  const navigate = useNavigate()
  const { validatorId } = useParams()
  const k = Object.keys(data[validatorId])
  const v = Object.values(data[validatorId])
  console.log("🚀 ~ ChainDetails ~ v", v)
  const chainId = v[0]
  return (
    <>
      <Center mb={3}>
        <Box backgroundColor="#171717" borderRadius={10} py={8} px={12}>
          <Text
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            fontSize="6xl"
            textTransform="capitalize"
          >
            {validatorId}
          </Text>
          <Divider my="12px" />
          <Stack>
            {k.map((key, i) => (
              <HStack gap={4}>
                <Text fontSize="2xl" textTransform="capitalize">
                  {key}:{" "}
                </Text>
                <Text fontSize="2xl" textTransform="capitalize">
                  {v[i]}
                </Text>
              </HStack>
            ))}
          </Stack>
        </Box>
      </Center>
      <Center>
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/list/${chainId}`)}
        >
          Back
        </Button>
      </Center>
    </>
  )
}

export default ChainDetails
