import { ChangeEvent, FC, useState } from "react"
import { addDefaultFieldsToObjectsList } from "../../utils/mappings"
import {
	ListTypes,
	SonrObject,
	objectsSelectionCheckbox,
} from "../../utils/types"
import SearchableList from "../SearchableList"

type Props = {
	label: string
	schemaDid: string
	objects: SonrObject[]
	onChange: (cid: string) => (checked: boolean) => void
	initialOpenState: boolean
	checkboxes: objectsSelectionCheckbox[]
}
const CheckboxListGroupComponent = ({
	label,
	schemaDid,
	objects,
	onChange,
	checkboxes,
	initialOpenState,
}: Props) => {
	const [isOpen, setIsOpen] = useState(initialOpenState)

	const mapToListFormat = (objects: SonrObject[]) =>
		objects
			.map((object) => ({
				fields: object.data,
				cid: object.cid,
				schemaDid,
				listItem: {
					"": {
						Component: CheckboxElement,
						props: {
							checked: checkboxes.find(
								(checkbox) => checkbox.cid === object.cid
							)!.checked,
							onChange: onChange(object.cid),
						},
						shrinkColumn: true,
					},
				},
			}))
			.map(addDefaultFieldsToObjectsList)

	const onChangeTopCheckbox = () => {
		const check = checkboxes.every((checkbox) => checkbox.checked)
			? false
			: true
		checkboxes.map((checkbox) => onChange(checkbox.cid)(check))
	}
	return objects.length === 0 ? (
		<></>
	) : isOpen ? (
		<div className="flex flex-col mb-4 px-2">
			<div className="flex bg-surface-button-subtle-hovered text-white rounded-t-md">
				<label className="flex gap-4 px-4 py-2">
					<input
						type="checkbox"
						checked={checkboxes.every((checkbox) => checkbox.checked)}
						onChange={onChangeTopCheckbox}
					/>
					<span>{label}</span>
				</label>

				<div className="flex-1" onClick={() => setIsOpen(false)}></div>
			</div>

			<SearchableList
				hideSearchBar={true}
				initialList={mapToListFormat(objects)}
				type={ListTypes.object}
				loading={false}
			/>
		</div>
	) : (
		<div className="flex bg-surface-button-subtle-hovered text-white rounded-md mx-2 mb-4">
			<label className="flex gap-4 px-4 py-2">
				<input
					type="checkbox"
					checked={checkboxes.every((checkbox) => checkbox.checked)}
					onChange={onChangeTopCheckbox}
				/>
				<span>{label}</span>
			</label>

			<div className="flex-1" onClick={() => setIsOpen(true)}></div>
		</div>
	)
}

type CheckboxElementProps = {
	checked: boolean
	onChange: (checked: boolean) => void
}
const CheckboxElement: FC<CheckboxElementProps> = ({
	checked,
	onChange,
}: CheckboxElementProps) => {
	return (
		<div>
			<input
				checked={checked}
				type="checkbox"
				onChange={(event: ChangeEvent<HTMLInputElement>) =>
					onChange(event.target.checked)
				}
			/>
		</div>
	)
}

export default CheckboxListGroupComponent
