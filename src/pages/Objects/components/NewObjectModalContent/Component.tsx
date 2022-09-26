import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import { Button, NebulaIcon } from "@sonr-io/nebula-react"
import FileDropInput from "../../../../components/FileDropInput"
import { fileToByteArray } from "../../../../utils/files"
import { slugify } from "../../../../utils/string"
import { Bucket, SchemaField, SchemaMeta } from "../../../../utils/types"

interface NewSchemaModalContentComponentProps {
	onClose: () => void
	onSave: () => void
	onChangeSchema: Dispatch<SetStateAction<string>>
	onChangeBucket: (value: string) => void
	onChangeProperty: (index: number, value: string) => void
	schemas: Array<SchemaMeta>
	buckets: Array<Bucket>
	properties: Array<Record<string, any>>
	selectedSchema: string
	selectedBucket: string
	error: string
}

function NewObjectModalContentComponent({
	onClose,
	onSave,
	onChangeSchema,
	onChangeBucket,
	onChangeProperty,
	schemas,
	properties,
	buckets,
	selectedSchema,
	selectedBucket,
	error,
}: NewSchemaModalContentComponentProps) {
	return (
		<div className="flex flex-col max-h-[90vh]">
			<div className="flex justify-between px-8 my-8">
				<div>
					<span className="text-custom-2xs text-default uppercase font-semibold tracking-custom-x2wider">
						Create Object
					</span>
				</div>
				<div
					className="cursor-pointer text-button-transparent tracking-custom-tight text-custom-sm font-extrabold"
					onClick={onClose}
				>
					Cancel
				</div>
			</div>

			<div className="flex px-8 mb-8 -mr-4">
				<div className="w-full flex flex-col justify-start pr-4">
					<div className="text-default text-custom-sm mb-2 font-extrabold">
						Schema
					</div>
					<div className="relative pointer-events-none select-none border border-default-border rounded-md cursor-pointer flex justify-between">
						<select
							className="appearance-none py-2 px-3 rounded-md pointer-events-auto cursor-pointer w-full"
							onChange={(event) => onChangeSchema(event.target.value)}
							value={selectedSchema}
						>
							{schemas.map((item: SchemaMeta) => (
								<option key={item.did} value={item.did}>
									{item.label}
								</option>
							))}
						</select>
						<NebulaIcon
							iconName="ArrowSquareDown"
							iconType="duotone"
							className="w-8 h-8 pointer-events-none select-none absolute right-0 top-1"
						/>
					</div>
				</div>

				<div className="w-full flex flex-col justify-start  pr-4">
					<div className="text-default text-custom-sm mb-2 font-extrabold">
						Bucket
					</div>
					<div className="relative pointer-events-none select-none border border-default-border rounded-md cursor-pointer flex justify-between">
						<select
							className="appearance-none py-2 px-3 rounded-md pointer-events-auto cursor-pointer w-full"
							onChange={(event) => onChangeBucket(event.target.value)}
							value={selectedBucket}
						>
							{buckets.map((item: Bucket) => (
								<option key={item.did} value={item.did}>
									{item.label}
								</option>
							))}
						</select>

						<NebulaIcon
							iconName="ArrowSquareDown"
							iconType="duotone"
							className="w-8 h-8 pointer-events-none select-none absolute right-0 top-1"
						/>
					</div>
				</div>
			</div>

			<div className="flex-1 flex flex-col px-8 rounded-2xl overflow-auto">
				<div className="mb-4 text-default text-custom-sm font-extrabold">
					Properties
				</div>

				<div className="overflow-auto flex flex-wrap box-border -mr-4">
					{properties.map((item, index) => (
						<div
							key={`${item.name}-${index}`}
							className="box-border flex-[50%] pr-4 mb-4"
						>
							<div className="text-custom-xs text-subdued pb-1">
								{item.name}
							</div>
							<SchemaFieldInput
								field={{ name: item.name, type: item.type }}
								onChange={(value) => onChangeProperty(index, value)}
							/>
						</div>
					))}
				</div>
			</div>
			{error && (
				<div className="ml-8">
					<span className="text-tertiary-red block text-xs">{error}</span>
				</div>
			)}
			<div className="bg-black w-full rounded-b-2xl justify-end flex relative">
				<div className="absolute rounded-b-2xl w-full h-6 bg-white -top-px" />
				<Button
					styling="w-48 h-12 mb-6 mt-12 mr-8 justify-center items-center text-custom-md font-extrabold tracking-custom-tight"
					onClick={onSave}
					label="Save"
				/>
			</div>
		</div>
	)
}

type Props = {
	field: SchemaField
	onChange: (value: string) => void
}

async function onLoad(files: any, onChange: any) {
	const file = files[0]
	console.log("file", file)
	const buffer = await fileToByteArray(file)
	onChange({ buffer, fileName: file.name })
}

function onDrop(files: any) {
	console.log("Drop")
}

async function onInput(event: any, onChange: any) {
	const file = event.target.files[0]
	const buffer = await fileToByteArray(file)
	onChange({ buffer, fileName: file.name })
}

const SchemaFieldInput = ({ field, onChange }: Props) => {
	switch (field.type) {
		case 0:
			return <ListInput onChange={onChange} />
		case 1:
			return (
				<select
					className="border border-default-border rounded w-full p-2"
					onChange={(event) => onChange(event.target.value)}
				>
					<option></option>
					<option value="true">True</option>
					<option value="false">False</option>
				</select>
			)
		case 2:
			return (
				<input
					type="number"
					className="border border-default-border rounded-md w-full p-2"
					onChange={(event) => onChange(event.target.value)}
				/>
			)
		case 3:
			return (
				<input
					type="number"
					className="border border-default-border rounded-md w-full p-2"
					onChange={(event) => onChange(event.target.value)}
				/>
			)
		case 4:
			return (
				<input
					type="text"
					className="border border-default-border rounded-md w-full p-2"
					onChange={(event) => onChange(event.target.value)}
				/>
			)
		case 5:
			return (
				<FileDropInput
					onDrop={(files: any) => onLoad(files, onChange)}
					dropId={slugify(field.name)}
					onLoad={(files: any) => onLoad(files, onChange)}
					onInput={(event: any) => onInput(event, onChange)}
				/>
			)

		default:
			return <div className="italic text-subdued">Unrecognized field type</div>
	}
}

const ListInput = ({ onChange }: { onChange: (value: string) => void }) => {
	const [values, setValues] = useState<string[]>([""])
	const addItem = () => setValues((values) => [...values, ""])
	const onChangeItem =
		(key: number) => (event: ChangeEvent<HTMLInputElement>) => {
			setValues((values) => {
				values[key] = event.target.value
				return [...values]
			})
			onChange(JSON.stringify(values))
		}
	return (
		<div>
			{values.map((value, key) => (
				<div>
					<input
						className="border border-black"
						value={value}
						onChange={onChangeItem(key)}
					/>
				</div>
			))}
			<button onClick={addItem}>Add item</button>
		</div>
	)
}

export default NewObjectModalContentComponent
