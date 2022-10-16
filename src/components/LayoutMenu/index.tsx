import { FC, ReactNode } from "react"
import SideMenu from "../SideMenu"
import AppModal from "../AppModal"

type Props = { children: ReactNode }
const Component: FC<Props> = ({ children }) => {
  return (
    <div className="flex">
      <SideMenu />
      <div className="h-screen w-full bg-gray-100 overflow-auto">
        {children}
      </div>
      <AppModal />
    </div>
  )
}

export default Component
