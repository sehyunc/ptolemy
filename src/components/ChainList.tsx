import { Box, Center, Heading, Text } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import data from "../mockData.json"
import Header from "./Header"
import Row from "./Row"

const ChainList = () => {
	const { chainId } = useParams()
	const validators = Object.entries(data).filter(
		([, d]) => d.chainName === chainId
	)
	return (
		<>
			<Center>
				<Heading
					bgGradient="linear(to-l, #7928CA, #FF0080)"
					bgClip="text"
					fontSize="6xl"
					textTransform="capitalize"
				>
					{chainId}
				</Heading>
			</Center>
			<Box mx="auto" maxWidth="container.xl" p={12}>
				<Header />
				{validators.map(([address, { chainName, credit, discord, reddit }]) => (
					<Row
						address={address}
						chainName={chainName}
						credit={credit}
						discord={discord}
						reddit={reddit}
					/>
				))}
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
