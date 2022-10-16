import axios from "axios"
import { useColorMode } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Routes, Route, Link, Outlet } from "react-router-dom"
import ChainGrid from "./components/ChainGrid"
import ChainList from "./components/ChainList"

const App = () => {
	const { colorMode, setColorMode } = useColorMode()

	useEffect(() => {
		if (colorMode === "light") setColorMode("dark")
	}, [colorMode, setColorMode])

	return (
		<Routes>
			<Route
				path="/"
				element={
					<div style={{ padding: "64px" }}>
						<Outlet />
					</div>
				}
			>
				<Route
					index
					element={
						<>
							<Login />
							<MainPage />
						</>
					}
				/>
				<Route path="chains" element={<ChainGrid />} />
				<Route path="list" element={<Outlet />}>
					<Route path=":chainId" element={<ChainList />} />
				</Route>
			</Route>
		</Routes>
	)
}

const Login = () => {
	const [userAddress, setAddress] = useState<string>("")
	const [password, setPassword] = useState<string>("")

	const createAcc = async () => {
		// http://localhost:8080/api/v1/account/create

		const pass = { password: password }
		axios
			.post("http://localhost:4040/api/v1/account/create", pass)
			.then((response: any) => console.log(response))
	}

	const loginUser = async () => {
		const loginInfo = { password: password, address: userAddress }
		axios
			.post("http://localhost:4040/api/v1/account/login", loginInfo)
			.then((response: any) => console.log(response))
	}

	const handleTextInputChange = (e: any) => {
		setPassword(e.target.value)
	}

	const handleTextInputChangeAddress = (e: any) => {
		setAddress(e.target.value)
	}

	return (
		<div>
			<h1>Login Stuff</h1>
			<h1>
				Create Account (*Create account with password but login with userAddress
				and Password)
			</h1>
			<label>
				User Address:
				<input
					type="text"
					value={userAddress}
					name="address"
					style={{ border: "1px solid red" }}
					onChange={(e) => handleTextInputChangeAddress(e)}
				/>
			</label>
			<label>
				User Password:
				<input
					type="text"
					value={password}
					name="password"
					style={{ border: "1px solid red" }}
					onChange={(e) => handleTextInputChange(e)}
				/>
			</label>
			&nbsp;
			<input
				type="submit"
				value="Create Account"
				style={{ background: "#eee" }}
				onClick={() => createAcc()}
			/>
			&nbsp; &nbsp;
			<input
				type="submit"
				value="Login User"
				style={{ background: "#eee" }}
				onClick={() => loginUser()}
			/>
		</div>
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
