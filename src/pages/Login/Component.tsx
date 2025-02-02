import { FormEvent } from "react"
import ClosedEyeSvg from "../../assets/svgs/ClosedEye"
import OpenEyeSvg from "../../assets/svgs/OpenEye"
import LayoutAuth from "../../components/LayoutAuth"
import TextInput from "../../components/TextInput"
import { ROUTE_LOGIN } from "../../utils/constants"
import { Button } from "@sonr-io/nebula-react"

type Props = {
  onSubmit: () => void
  errors: Record<string, any>
  togglePasswordVisible: () => void
  passwordVisible: boolean
  setPassword: React.Dispatch<React.SetStateAction<string>>
  addressOrAlias: string
  setAddressOrAlias: React.Dispatch<React.SetStateAction<string>>
  password: string
  loginError: string
}

const Component = ({
  onSubmit,
  errors,
  togglePasswordVisible,
  setPassword,
  passwordVisible,
  addressOrAlias,
  setAddressOrAlias,
  password,
  loginError,
}: Props) => {
  const _onSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <LayoutAuth
      route={ROUTE_LOGIN}
      sidebarContent={
        <div className=" max-w-[479px] flex flex-col mt-40 ml-14">
          <div className="text-custom-3xl font-extrabold tracking-custom-x2tighter mb-6">
            Welcome to Sonr hello Sishir
          </div>
          <div className="text-custom-md font-normal tracking-custom-tight mb-10">
            We're glad you're here.
            <br />
            Enter your Wallet Address and Vault Password to continue.
          </div>
        </div>
      }
      content={
        <div className="flex flex-col justify-center w-full max-w-sm">
          <h1 className="text-custom-xl font-extrabold mb-8 text-emphasis">
            Login to Your Vault
          </h1>

          <form onSubmit={_onSubmit} className="w-full">
            <TextInput
              error={errors?.addressOrAlias?.isRequired}
              className="text-white mb-4"
              label="Domain or Wallet Address"
              ariaLabel="Domain or Wallet Address"
              handleOnChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAddressOrAlias(event.target.value)
              }}
              value={addressOrAlias}
              type="text"
            />
            <TextInput
              error={errors?.vaultPassword?.isRequired || loginError}
              RightIcon={passwordVisible ? OpenEyeSvg : ClosedEyeSvg}
              rightIconOnClick={togglePasswordVisible}
              className="text-white"
              label="Vault Password"
              ariaLabel="Vault Password"
              handleOnChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value)
              }}
              value={password}
              type={passwordVisible ? "text" : "password"}
            />
            <Button
              type="submit"
              styling="border rounded block w-full mt-12 justify-center text-custom-md font-extrabold"
              label="Submit"
            />
          </form>
        </div>
      }
    />
  )
}

export default Component
