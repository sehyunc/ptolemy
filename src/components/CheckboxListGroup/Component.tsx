import { ChangeEvent, FC, useState } from "react"
import IconArrowheadDown from "../../assets/svgs/IconArrowheadDown"
import IconArrowheadUp from "../../assets/svgs/IconArrowheadUp"
import {
	ListTypes,
	SonrObject,
	objectsSelectionCheckbox,
	SchemaMeta,
	SearchableListItem,
} from "../../utils/types"
import ByteTypeDownloadButton from "../ByteTypeDownloadButton"
import SearchableList from "../SearchableList"

type Props = {
	schema: SchemaMeta
	objects: SonrObject[]
	onChange: (cid: string) => (checked: boolean) => void
	initialOpenState: boolean
	checkboxes: objectsSelectionCheckbox[]
}
const CheckboxListGroupComponent = ({
	schema,
	objects,
	onChange,
	checkboxes,
	initialOpenState,
}: Props) => {
	const [isOpen, setIsOpen] = useState(initialOpenState)

	const getList = () =>
		objects.map((object) => {
			const objectReducer =
				(object: SonrObject) => (listItem: SearchableListItem, key: string) => {
					const schemaField = schema.fields.find((field) => field.name === key)!
					listItem[key] =
						schemaField.type === 5
							? {
									text: "",
									Component: ByteTypeDownloadButton,
									props: {
										cid: object.cid,
										schemaDid: schema.did,
										itemKey: key,
									},
							  }
							: {
									text: object.data[key],
							  }
					return listItem
				}

			const initial = {
				"": {
					Component: CheckboxElement,
					props: {
						checked: checkboxes.find((checkbox) => checkbox.cid === object.cid)!
							.checked,
						onChange: onChange(object.cid),
					},
					shrinkColumn: true,
				},
			}
			return Object.keys(object.data).reduce(objectReducer(object), initial)
		})

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
					<span>{schema.label}</span>
				</label>

				<div
					className="flex-1 flex items-center justify-end cursor-pointer px-4"
					onClick={() => setIsOpen(false)}
				>
					<IconArrowheadUp />
				</div>
			</div>

			<SearchableList
				hideSearchBar={true}
				initialList={getList()}
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
				<span>{schema.label}</span>
			</label>

			<div
				className="flex-1 flex items-center justify-end cursor-pointer px-4"
				onClick={() => setIsOpen(true)}
			>
				<IconArrowheadDown />
			</div>
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
