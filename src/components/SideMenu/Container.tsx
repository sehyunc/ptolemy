import { useContext } from "react"
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { AppSettingsContext } from "../../contexts/appSettingsContext/appSettingsContext"
import {
	BASE_API,
	ROOT_RESET,
	ROUTE_BUCKETS,
	ROUTE_OBJECTS,
	ROUTE_SCHEMAS,
} from "../../utils/constants"
import SideMenuComponentCollapsed from "./ComponentCollapsed"
import SideMenuComponentExpanded from "./ComponentExpanded"

const pageLinks = [
	{
		route: ROUTE_SCHEMAS,
		label: "Schemas",
		icon: "Note1",
	},
	{
		route: ROUTE_OBJECTS,
		label: "Objects",
		icon: "Box1",
	},
	{
		route: ROUTE_BUCKETS,
		label: "Buckets",
		icon: "Bag2",
	},
]

const externalLinks = [
	{
		route: ROUTE_SCHEMAS,
		label: "Access API",
		icon: "IconLinkAccessApi",
	},
	{
		route: ROUTE_OBJECTS,
		label: "Docs & Support",
		icon: "IconLinkDocsSupport",
	},
	{
		route: ROUTE_BUCKETS,
		label: "Report Bugs",
		icon: "AlertSvg",
	},
]

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
			pageLinks={pageLinks}
			externalLinks={externalLinks}
		/>
	) : (
		<SideMenuComponentExpanded
			navigate={navigate}
			currentPath={currentPath}
			onLogout={logout}
			onChangeSize={() => setMenusIsCollapsed(true)}
			pageLinks={pageLinks}
			externalLinks={externalLinks}
		/>
	)
}

export default SideMenuContainer
