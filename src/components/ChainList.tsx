//@ts-nocheck
import { Box, Button, Center, Heading, Text } from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { useNavigate, useParams } from "react-router-dom"
import data from "../mockData.json"
import Header from "./Header"
import Row from "./Row"
import vData from "../mockData"
console.log("🚀 ~ vData", vData)

const ChainList = () => {
  const navigate = useNavigate()
  const { chainId } = useParams()
  const validators = Object.entries(data).filter(
    ([, d]) => d.chainName === chainId
  )

  var gov_votes = []
  var block_proposed = []
  var power = []
  var delegators = []

  const normalize = (value, min, max) => {
    var normalized = parseFloat((value - min) / (max - min))
    return normalized
  }

  const onChainCalc = (valName) => {
    vData.sort()
    Object.entries(vData).map(([key, value]) => {
      if (valName === value.title) {
        gov_votes.push(parseFloat(value.governance_votes))
        block_proposed.push(parseFloat(value.blocks_proposed))
        power.push(parseFloat(value.power))
        delegators.push(parseFloat(value.delegators))
      }
    })

    var normalized_gov_vote = 0
    var normalized_block_proposed = 0
    var normalized_power = 0
    var normalized_delegators = 0
    var validator_score = 0

    // governance_votes (30%) + block_proposed (20%) + power (20%) + delegators (30%)

    Object.entries(vData).map(([key, value]) => {
      if (valName === value.title) {
        normalized_gov_vote = normalize(
          parseFloat(value.governance_votes),
          Math.min(...gov_votes),
          Math.max(...gov_votes)
        )
        normalized_block_proposed = normalize(
          parseFloat(value.blocks_proposed),
          Math.min(...block_proposed),
          Math.max(...block_proposed)
        )
        normalized_power = normalize(
          parseFloat(value.power),
          Math.min(...power),
          Math.max(...power)
        )
        normalized_delegators = normalize(
          parseFloat(value.delegators),
          Math.min(...delegators),
          Math.max(...delegators)
        )

        validator_score =
          normalized_gov_vote +
          normalized_block_proposed +
          normalized_power +
          normalized_delegators
      }
    })

    return validator_score
  }

  //@ts-ignore
  const calculateScore = (valName, valData) => {
    // off chain score
    let offchain_score = valData.credit + valData.discord + valData.reddit
    // on chain score
    let onchain_score = onChainCalc(valName)
    let final_score = offchain_score + onchain_score

    console.log(onchain_score)

    if (!final_score) {
      final_score = 0
    }

    var randVal = (Math.random() * (0 - 1) + 1).toFixed(2) + offchain_score
    return randVal
  }

  return (
    <>
      <Center>
        <Heading
          bgGradient={`linear(to-r, #39b48e, #fafa6e)`}
          bgClip="text"
          fontSize="6xl"
          textTransform="capitalize"
        >
          {chainId}
        </Heading>
      </Center>
      <Box mx="auto" maxWidth="container.xl" p={12}>
        <Header />
        {validators.map(
          ([address, { chainName, credit, discord, reddit, did }]) => {
            const score = calculateScore(address, {
              chainName,
              credit,
              discord,
              reddit,
            })

            return (
              <Row
                address={address}
                chainName={chainName}
                discord={discord}
                reddit={reddit}
                credit={score}
                did={did}
              />
            )
          }
        )}
        <Box
          display="flex"
          backgroundColor="#0e0e10"
          borderRight="1px solid #1f1f23"
          borderLeft="1px solid #1f1f23"
          borderBottom="1px solid #1f1f23"
          borderBottomEndRadius="10px"
          borderBottomStartRadius="10px"
          flexDirection="row-reverse"
          padding="6"
        >
          <Text opacity="0.65">Page 1 of 1</Text>
        </Box>
      </Box>
      <Center>
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={() => navigate("/chains")}
        >
          Back
        </Button>
      </Center>
    </>
  )
}

export default ChainList

// <div>
// 	<Flex flexDirection={"column"}>
// 		<Flex flexDirection={"row"} alignItems={"stretch"}>
// 			<div
// 				style={{ flex: 1, textAlign: "left", textDecoration: "underline" }}
// 			>
// 				Chain Name
// 			</div>
// 			<div
// 				style={{ flex: 1, textAlign: "left", textDecoration: "underline" }}
// 			>
// 				Address
// 			</div>
// 			<div
// 				style={{
// 					flex: 0.2,
// 					textAlign: "center",
// 					textDecoration: "underline",
// 				}}
// 			>
// 				Credit Score
// 			</div>
// 			<div
// 				style={{
// 					flex: 0.2,
// 					textAlign: "center",
// 					textDecoration: "underline",
// 				}}
// 			>
// 				Discord Score
// 			</div>
// 			<div
// 				style={{
// 					flex: 0.2,
// 					textAlign: "center",
// 					textDecoration: "underline",
// 				}}
// 			>
// 				Reddit Score
// 			</div>
// 		</Flex>
// 		{validators.map(([key, value]) => {
// 			return (
// 				<Flex flexDirection={"row"} alignItems={"stretch"}>
// 					<Link
// 						style={{ flex: 1, textAlign: "left" }}
// 						to={`/details/${key}`}
// 					>
// 						{key}
// 					</Link>
// 					<div style={{ flex: 1, textAlign: "left" }}>
// 						{value.chainName}
// 					</div>
// 					<div style={{ flex: 0.2, textAlign: "center" }}>
// 						{value.credit}
// 					</div>
// 					<div style={{ flex: 0.2, textAlign: "center" }}>
// 						{value.discord}
// 					</div>
// 					<div style={{ flex: 0.2, textAlign: "center" }}>
// 						{value.reddit}
// 					</div>
// 				</Flex>
// 			)
// 		})}
// 	</Flex>
// </div>
