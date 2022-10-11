import { Dispatch, SetStateAction, useState } from "react"
import { useSelector } from "react-redux"
import { selectAllObjects } from "../../redux/slices/bucketSlice"
import { objectsSelectionCheckbox, SchemaMeta } from "../../utils/types"
import CheckboxListGroupComponent from "./Component"

interface CheckboxListGroupContainerProps {
	schema: SchemaMeta
	checkboxes: objectsSelectionCheckbox[]
	onChange: (cid: string) => (checked: boolean) => void
	defaultOpen: boolean
}

const CheckboxListGroupContainer = ({
	schema,
	checkboxes,
	onChange,
	defaultOpen,
}: CheckboxListGroupContainerProps) => {
	const allObjects = useSelector(selectAllObjects)
	const [isOpen, setIsOpen] = useState(defaultOpen)

	return (
		<CheckboxListGroupComponent
			schema={schema}
			list={allObjects.filter((item) => item.schemaDid === schema.did)}
			onChange={onChange}
			checkboxes={checkboxes}
			isOpen={isOpen}
			toggleOpen={() => setIsOpen(!isOpen)}
		/>
	)
}

export default CheckboxListGroupContainer
