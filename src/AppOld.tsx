import axios from "axios"
import {
  useColorMode,
  Flex,
  Text,
  TabList,
  Tabs,
  Tab,
  TabPanel,
  Input,
  Button,
  TabPanels,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Routes, Route, Outlet } from "react-router-dom"
import ChainGrid from "./components/ChainGrid"
import ChainList from "./components/ChainList"
import ValidatorDetails from "./components/ValidatorDetails"
import TopBar from "./components/TopBar"

const App = () => {
  const { colorMode, setColorMode } = useColorMode()

  useEffect(() => {
    if (colorMode === "light") setColorMode("dark")
  }, [colorMode, setColorMode])

  return (
    <Routes>
      <Route path="/" element={<TopBar />}>
        <Route
          index
          element={
            <>
              <Login />
              <MainPage />
            </>
          }
        />

        <Route path="profile" element={<Profile />} />
        <Route path="chains" element={<ChainGrid />} />
        <Route path="list" element={<Outlet />}>
          <Route path=":chainId" element={<ChainList />} />
        </Route>
        <Route path="validator" element={<Outlet />}>
          <Route path=":validatorId" element={<ValidatorDetails />} />
        </Route>
      </Route>
    </Routes>
  )
}

const Profile = () => {
  return (
    <Flex>
      <Login />
    </Flex>
  )
}
const Login = () => {
  const [userAddress, setAddress] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [createAccLoading, setCreateAccLoading] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)

  const createAcc = async () => {
    // http://localhost:8080/api/v1/account/create
    setCreateAccLoading(true)
    const pass = { password: password }
    axios
      .post("http://localhost:4040/api/v1/account/create", pass)
      .then((response: any) => {
        console.log(response)
        setCreateAccLoading(false)
      })
  }

  const loginUser = async () => {
    setLoginLoading(true)
    const loginInfo = { password: password, address: userAddress }
    axios
      .post("http://localhost:4040/api/v1/account/login", loginInfo)
      .then((response: any) => {
        console.log(response)
        setLoginLoading(false)
      })
  }

  const handleTextInputChange = (e: any) => {
    setPassword(e.target.value)
  }

  const handleTextInputChangeAddress = (e: any) => {
    setAddress(e.target.value)
  }

  return (
    <Flex flexDir="column" width="100%" height="100vh" alignItems={"center"}>
      <Flex
        flexDir={"row"}
        width="60vh"
        alignSelf={"center"}
        background={"#111"}
        padding="20px"
      >
        <Tabs isFitted isLazy style={{ width: "100%" }}>
          <TabList>
            <Tab fontSize={"lg"}>Create Account</Tab>
            <Tab fontSize={"lg"}>SignIn</Tab>
          </TabList>
          <TabPanels alignItems={"center"}>
            {/* initially mounted */}

            <TabPanel>
              <Text fontSize={"sm"}>Password:</Text>
              <Input
                variant="flushed"
                value={password}
                onChange={handleTextInputChange}
                placeholder="Type your password"
                size="lg"
                width={"100%"}
              />
              <br /> <br />
              <Button
                bgGradient="linear(to-l, #7928CA, #FF0080)"
                width={"100%"}
                marginLeft="auto"
                marginRight="auto"
                isLoading={createAccLoading}
                onClick={() => createAcc()}
              >
                Create Account
              </Button>
            </TabPanel>
            {/* initially not mounted */}
            <TabPanel alignItems={"center"}>
              <br />
              <Text fontSize={"sm"}>User Address:</Text>
              <Input
                variant="flushed"
                value={userAddress}
                onChange={handleTextInputChangeAddress}
                placeholder="Type your address"
                size="lg"
                width={"100%"}
              />
              <br /> <br />
              <Text fontSize={"sm"}>Password:</Text>
              <Input
                variant="flushed"
                value={password}
                onChange={handleTextInputChange}
                placeholder="Type your password"
                size="lg"
                width={"100%"}
              />
              <br /> <br />
              <Button
                bgGradient="linear(to-l, #7928CA, #FF0080)"
                width={"100%"}
                marginLeft="auto"
                marginRight="auto"
                isLoading={loginLoading}
                onClick={() => loginUser()}
              >
                Sign In
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  )
}

const MainPage = () => {
  const [accInfo, setAccInfo] = useState("")

  useEffect(() => {
    axios
      .get("http://localhost:4040/api/v1/account/info")
      .then(function (response) {
        setAccInfo(response.data?.Address)
      })
  }, [])

  return (
    <div>
      <h1> Main Page Hello </h1>
      <h1>User Address: {accInfo}</h1>
    </div>
  )
}

export default App
