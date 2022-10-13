import {
	objectsSelectionCheckbox,
	SchemaMeta,
	SonrObject,
} from "../../utils/types"
import CheckboxListGroupComponent from "./Component"

interface CheckboxListGroupContainerProps {
	schema: SchemaMeta
	objects: SonrObject[]
	checkboxes: objectsSelectionCheckbox[]
	onChange: (cid: string) => (checked: boolean) => void
	initialOpenState: boolean
}

const CheckboxListGroupContainer = ({
	schema,
	objects,
	checkboxes,
	onChange,
	initialOpenState,
}: CheckboxListGroupContainerProps) => {
	return (
		<CheckboxListGroupComponent
			schema={schema}
			objects={objects}
			onChange={onChange}
			checkboxes={checkboxes}
			initialOpenState={initialOpenState}
		/>
	)
}

export default CheckboxListGroupContainer
