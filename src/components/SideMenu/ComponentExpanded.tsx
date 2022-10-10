import SonrLogoSvg from "../../assets/svgs/SonrLogo"
import ButtonGroup from "./components/ButtonsGroup"
import { NavigateFunction } from "react-router-dom"
import {
	ROUTE_OBJECTS,
	ROUTE_SCHEMAS,
	ROUTE_BUCKETS,
} from "../../utils/constants"
import { useSelector } from "react-redux"
import {
	selectAddress,
	selectAlias,
} from "../../redux/slices/authenticationSlice"
import IconLinkAccessApi from "../../assets/svgs/LinkAccessApi"
import IconLinkDocsSupport from "../../assets/svgs/LinkDocsSupport"
import AlertSvg from "../../assets/svgs/Alert"
import LeftSquareIconSvg from "../../assets/svgs/LeftSquaredIcon"
import MenuLink from "./components/MenuLink"
import IconUserProfile from "../../assets/svgs/IconUserProfile"

const modulesButtons = [
	{
		label: "Schemas",
		iconName: "Note1",
		route: ROUTE_SCHEMAS,
	},
	{
		label: "Objects",
		iconName: "Box1",
		route: ROUTE_OBJECTS,
	},
	{
		label: "Buckets",
		iconName: "Bag2",
		route: ROUTE_BUCKETS,
	},
]

interface SideMenuComponentExpandedProps {
	navigate: NavigateFunction
	currentPath: string
	onLogout: () => void
	onChangeSize: () => void
}

function SideMenuComponentExpanded({
	navigate,
	currentPath,
	onLogout,
	onChangeSize,
}: SideMenuComponentExpandedProps) {
	const address = useSelector(selectAddress)
	const alias = useSelector(selectAlias)

	return (
		<div className="w-80 dark text-default flex flex-col bg-brand-tertiary h-screen px-4 py-[42px] shrink-0 z-10">
			<div className="justify-between flex  items-center w-full mb-10 cursor-pointer">
				<div className="flex justify-center">
					<div className="w-11 h-11">
						<SonrLogoSvg />
					</div>

					<span className="font-extrabold tracking-custom-tighter text-custom-xl">
						Speedway
					</span>
				</div>

				<div onClick={onChangeSize} className="cursor-pointer">
					<LeftSquareIconSvg />
				</div>
			</div>

			<div className="border-b border-outlined-disabled mb-10 w-full h-px" />

			<div className="flex-1">
				<ButtonGroup
					title="Modules"
					navigate={navigate}
					currentPath={currentPath}
					buttons={modulesButtons}
					className="mb-10"
				/>

				<div className="text-custom-2xs uppercase font-semibold text-subdued mb-6">
					Tools
				</div>
				<MenuLink
					label="Access API"
					href="/docs/index.html"
					Icon={IconLinkAccessApi}
				/>
				<MenuLink
					label="Docs & Support"
					href="https://docs.sonr.io/"
					Icon={IconLinkDocsSupport}
				/>
				<MenuLink
					label="Report Bugs"
					href="mailto:speedway@sonr.io"
					Icon={() => (
						<span className="mr-2">
							<div className="w-6 flex items-center">
								<AlertSvg />
							</div>
						</span>
					)}
				/>
			</div>

			<div className="border-b border-outlined-disabled mb-10 w-full h-px" />

			<div className="flex gap-2 px-2" onClick={onLogout}>
				<div>
					<IconUserProfile />
				</div>
				<div className="flex-1 break-words text-ellipsis overflow-hidden whitespace-nowrap font-semibold">
					{alias || address}
				</div>
			</div>
		</div>
	)
}

export default SideMenuComponentExpanded
