import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, Center, HStack, Stack, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

const Home: React.FC = () => {
  const navigate = useNavigate()
  return (
    <Center backgroundColor="#000" position="relative">
      <Stack textAlign="center">
        <Text
          bgGradient={`linear(to-r, #39b48e, #fafa6e)`}
          bgClip="text"
          fontWeight="bold"
          fontSize={{ base: "10vw", md: "6xl", xl: "75px" }}
        >
          Ptolemy
        </Text>
        <Text
          bgGradient={`linear(to-r, #39b48e, #fafa6e)`}
          bgClip="text"
          fontWeight="bold"
          fontSize={{ base: "7vw", md: "4xl", xl: "50px" }}
        >
          Reputation Score for Validators
        </Text>
        <Stack>
          <Text fontWeight="semibold" fontSize="lg">
            Choose who to delegate your tokens to based on empirical data
          </Text>
        </Stack>
        <Center>
          <Button
            marginTop={6}
            size="lg"
            variant="outline"
            colorScheme="gray"
            rightIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/chains")}
            maxW={48}
          >
            Enter App
          </Button>
        </Center>
      </Stack>
    </Center>
  )
}

export default Home
