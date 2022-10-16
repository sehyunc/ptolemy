import { Box, Center, Grid, Heading, Text } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"

const chains = ["osmosis", "juno", "secret network", "evmos", "kava"]

const ChainGrid = () => {
	return (
		<div>
			<Grid templateColumns="repeat(3, 1fr)" gap={6}>
				{chains.map((c) => (
					<Box
						backgroundColor="#0e0e10"
						border="1px solid #1f1f23"
						borderRadius="10"
						cursor="pointer"
						paddingX="5"
						paddingY="6"
						textTransform="capitalize"
						_hover={{
							opacity: 0.7,
						}}
					>
						<Center>
							<Text fontWeight="bold" fontSize="xl">
								{c}
							</Text>
						</Center>
					</Box>
				))}
			</Grid>
		</div>
	)
}

export default ChainGrid
