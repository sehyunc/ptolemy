import { Dispatch, SetStateAction, useState } from "react"
import { useSelector } from "react-redux"
import { selectAllObjects } from "../../redux/slices/bucketSlice"
import { objectsSelectionCheckbox, SchemaMeta } from "../../utils/types"
import CheckboxListGroupComponent from "./Component"

interface CheckboxListGroupContainerProps {
	schema: SchemaMeta
	checkboxes: objectsSelectionCheckbox[]
	setCheckboxes: Dispatch<SetStateAction<objectsSelectionCheckbox[]>>
	onChange: (cid: string) => (checked: boolean) => void
	defaultOpen: boolean
}

function CheckboxListGroupContainer({
	schema,
	checkboxes,
	setCheckboxes,
	onChange,
	defaultOpen,
}: CheckboxListGroupContainerProps) {
	const allObjects = useSelector(selectAllObjects)

	const [mainCheckboxIsChecked, setMainCheckboxIsChecked] = useState(false)
	const [isOpen, setIsOpen] = useState(defaultOpen)

	function onChangeMainCheckbox() {
		const currentMainCheckboxIsChecked = !mainCheckboxIsChecked
		setCheckboxes(
			checkboxes.map((checkbox) => ({
				...checkbox,
				checked:
					checkbox.schemaDid === schema.did
						? currentMainCheckboxIsChecked
						: checkbox.checked,
			}))
		)
		setMainCheckboxIsChecked(currentMainCheckboxIsChecked)
	}

	return (
		<CheckboxListGroupComponent
			schema={schema}
			list={allObjects.filter((item) => item.schemaDid === schema.did)}
			onChangeMainCheckbox={onChangeMainCheckbox}
			mainCheckboxIsChecked={mainCheckboxIsChecked}
			onChange={onChange}
			checkboxes={checkboxes}
			isOpen={isOpen}
			toggleOpen={() => setIsOpen(!isOpen)}
		/>
	)
}

export default CheckboxListGroupContainer
