import { objectsSelectionCheckbox, SonrObject } from "../../utils/types"
import CheckboxListGroupComponent from "./Component"

interface CheckboxListGroupContainerProps {
	label: string
	schemaDid: string
	objects: SonrObject[]
	checkboxes: objectsSelectionCheckbox[]
	onChange: (cid: string) => (checked: boolean) => void
	initialOpenState: boolean
}

const CheckboxListGroupContainer = ({
	label,
	schemaDid,
	objects,
	checkboxes,
	onChange,
	initialOpenState,
}: CheckboxListGroupContainerProps) => {
	return (
		<CheckboxListGroupComponent
			label={label}
			schemaDid={schemaDid}
			objects={objects}
			onChange={onChange}
			checkboxes={checkboxes}
			initialOpenState={initialOpenState}
		/>
	)
}

export default CheckboxListGroupContainer
