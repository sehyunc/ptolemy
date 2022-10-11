import { ChangeEvent, FC } from "react"
import { addDefaultFieldsToObjectsList } from "../../utils/mappings"
import {
	ListTypes,
	SchemaMeta,
	SearchableListType,
	SearchableListItem,
	SonrObject,
	objectsSelectionCheckbox,
} from "../../utils/types"
import SearchableList from "../SearchableList"

interface CheckboxListGroupComponentProps {
	schema: SchemaMeta
	list: SonrObject[]
	onChangeMainCheckbox: () => void
	mainCheckboxIsChecked: boolean
	onChange: (cid: string) => (checked: boolean) => void
	toggleOpen: () => void
	checkboxes: objectsSelectionCheckbox[]
	isOpen: boolean
}

function CheckboxListGroupComponent({
	schema,
	list,
	onChangeMainCheckbox,
	mainCheckboxIsChecked,
	onChange,
	checkboxes,
	isOpen,
	toggleOpen,
}: CheckboxListGroupComponentProps) {
	const mapToListFormat = (
		objects: SonrObject[],
		schemaDid: string
	): SearchableListType => {
		const newList = objects.map(
			({ cid, data }: SonrObject): SearchableListItem => {
				const listItem: SearchableListItem = {}
				const checkbox = checkboxes.find(
					(checkbox) =>
						checkbox.cid === cid && checkbox.schemaDid === schema.did
				)

				if (checkbox) {
					listItem[""] = {
						text: "",
						Component: CheckboxElement,
						props: {
							checked: checkbox.checked,
							onChange: onChange(cid),
						},
						shrinkColumn: true,
					}
				}

				return addDefaultFieldsToObjectsList({
					fields: data,
					cid,
					schemaDid,
					listItem,
				})
			}
		)

		return newList
	}

	return list.length === 0 ? (
		<></>
	) : isOpen ? (
		<div className="flex flex-col mb-4 px-2">
			<div className="flex bg-surface-button-subtle-hovered text-white rounded-t-md">
				<label className="flex gap-4 px-4 py-2">
					<input
						type="checkbox"
						checked={mainCheckboxIsChecked}
						onChange={onChangeMainCheckbox}
					/>
					<span>{schema.label}</span>
				</label>

				<div className="flex-1" onClick={toggleOpen}></div>
			</div>

			<SearchableList
				hideSearchBar={true}
				initialList={mapToListFormat(list, schema.did)}
				type={ListTypes.object}
				loading={false}
			/>
		</div>
	) : (
		<div className="flex bg-surface-button-subtle-hovered text-white rounded-md mx-2 mb-4">
			<label className="flex gap-4 px-4 py-2">
				<input
					type="checkbox"
					checked={mainCheckboxIsChecked}
					onChange={onChangeMainCheckbox}
				/>
				<span>{schema.label}</span>
			</label>

			<div className="flex-1" onClick={toggleOpen}></div>
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
