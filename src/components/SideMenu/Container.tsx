import { useContext } from "react"
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { AppSettingsContext } from "../../contexts/appSettingsContext/appSettingsContext"
import { BASE_API, ROOT_RESET } from "../../utils/constants"
import SideMenuComponentCollapsed from "./ComponentCollapsed"
import SideMenuComponentExpanded from "./ComponentExpanded"

function SideMenuContainer() {
	const { menuIsCollapsed, setMenusIsCollapsed } =
		useContext(AppSettingsContext)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const currentPath = location.pathname

	const logout = async () => {
		if (!process.env.REACT_APP_DEV_MODE) {
			return
		}

		await fetch(`${BASE_API}/logout`, { method: "GET" })
		dispatch({ type: ROOT_RESET })
		navigate("/")
	}

	return menuIsCollapsed ? (
		<SideMenuComponentCollapsed
			navigate={navigate}
			currentPath={currentPath}
			onLogout={logout}
			onChangeSize={() => setMenusIsCollapsed(false)}
		/>
	) : (
		<SideMenuComponentExpanded
			navigate={navigate}
			currentPath={currentPath}
			onLogout={logout}
			onChangeSize={() => setMenusIsCollapsed(true)}
		/>
	)
}

export default SideMenuContainer
