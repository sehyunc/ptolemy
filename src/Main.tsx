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
import { Routes, Route, Outlet, useNavigate } from "react-router-dom"
import ChainGrid from "./components/ChainGrid"
import ChainList from "./components/ChainList"
import ValidatorDetails from "./components/ValidatorDetails"
import TopBar from "./components/TopBar"
import LandingPage from "./LandingPage"

const Main = () => {
  const { colorMode, setColorMode } = useColorMode()

  useEffect(() => {
    if (colorMode === "light") setColorMode("dark")
  }, [colorMode, setColorMode])

  return (
    <Routes>
      <Route path="/" element={<TopBar />}>
        <Route index element={<LandingPage />} />

        <Route path="profile" element={<Login />} />
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

const Login = () => {
  const navigate = useNavigate()

  const [userAddress, setAddress] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [createAccLoading, setCreateAccLoading] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)

  const createAcc = async () => {
    setCreateAccLoading(true)
    const pass = { password: password }
    axios
      .post("http://localhost:4040/api/v1/account/create", pass)
      .then((response: any) => {
        console.log("ACCOUNT CREATION", response.data)
        setCreateAccLoading(false)
        if (response.data?.address) {
          var addr = localStorage.getItem("addr")
          if (!addr) {
            localStorage.setItem("addr", response.data.address)
          }
        }
      })
      .catch((err) => {
        setCreateAccLoading(false)
        console.log(err)
      })
  }

  useEffect(() => {
    axios
      .get("http://localhost:4040/api/v1/account/info")
      .then((response: any) => {
        console.log(response)
        if (response.data?.Address) {
          var addr = localStorage.getItem("addr")
          if (!addr) {
            localStorage.setItem("addr", response.data.address)
          }
          navigate("/chains")
        }
      })
      .catch((err) => {
        setCreateAccLoading(false)
        console.log(err)
      })
  }, [])

  const loginUser = async () => {
    setLoginLoading(true)
    const loginInfo = { password: password, address: userAddress }
    axios
      .post("http://localhost:4040/api/v1/account/login", loginInfo)
      .then((response: any) => {
        console.log("LOGIN USER", response.data)
        setLoginLoading(false)
        if (response.data?.address) {
          var addr = localStorage.getItem("addr")
          if (!addr) {
            localStorage.setItem("addr", response.data.address)
          }
          navigate("/chains")
        }
      })
      .catch((err) => {
        setCreateAccLoading(false)
        console.log(err)
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
        borderRadius={10}
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
                bgGradient={`linear(to-r, #39b48e, #fafa6e)`}
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
                bgGradient={`linear(to-r, #39b48e, #fafa6e)`}
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

export default Main
