import { Outlet, useLocation, useNavigate } from "react-router-dom"

import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react"

const TopBar = () => {
	const { pathname } = useLocation()
	const navigate = useNavigate()

	return (
		<>
			<Box bg="black" borderBottom="1px solid #1f1f23" px="64px" pt="16px">
				<Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
					<Flex alignItems="center" onClick={() => navigate("/")}>
						<Heading>Lumos</Heading>
					</Flex>
					<Spacer />
					<Button>Profile</Button>
				</Flex>
			</Box>
			<div style={{ padding: "64px" }}>
				<Outlet />
			</div>
		</>
	)
}

export default TopBar
