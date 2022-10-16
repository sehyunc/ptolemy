import { Outlet, useNavigate, Link } from "react-router-dom"
import { Box, Button, Flex, Heading, Spacer } from "@chakra-ui/react"

const TopBar = (userAddr: any) => {
  const navigate = useNavigate()
  // TODO: SHOW USER ADDRESS IN PROFILE
  // TODO: USE NORMALIZEDD DATA
  const addr = localStorage.getItem("addr")
  const formattedAddr = addr ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : ""

  return (
    <>
      <Box bg="black" borderBottom="1px solid #1f1f23" px="64px" py="16px">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Flex
            alignItems="center"
            cursor="pointer"
            onClick={() => navigate("/chains")}
          >
            <Heading>Lumos</Heading>
          </Flex>
          <Spacer />
          <Link to={"/profile"}>
            <Button>{formattedAddr ? formattedAddr : "Profile"}</Button>
          </Link>
        </Flex>
      </Box>
      <div style={{ padding: "64px" }}>
        <Outlet />
      </div>
    </>
  )
}

export default TopBar
