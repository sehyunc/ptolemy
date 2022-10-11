import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import RefreshSvg from "../../assets/svgs/Refresh"
import CheckboxListGroup from "../../components/CheckboxListGroup"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import {
	selectAllObjects,
	selectBucketCreationLoading,
	selectBuckets,
	userCreateBucket,
	userGetAllBuckets,
	userGetAllObjects,
} from "../../redux/slices/bucketSlice"
import {
	selectSchemasMetadataList,
	userGetAllSchemas,
} from "../../redux/slices/schemasSlice"
import { AppDispatch } from "../../redux/store"
import { Bucket, objectsSelectionCheckbox } from "../../utils/types"

const ModalCreateBucket = () => {
	const [label, setLabel] = useState("")
	const { closeModal } = useContext(AppModalContext)
	const dispatch = useDispatch<AppDispatch>()
	const [error, setError] = useState("")
	const address = useSelector(selectAddress)
	const buckets = useSelector(selectBuckets)
	const schemas = useSelector(selectSchemasMetadataList)
	const allObjects = useSelector(selectAllObjects)
	const [checkboxes, setCheckboxes] = useState<objectsSelectionCheckbox[]>([])

	useEffect(() => {
		initialize()
	}, [buckets])

	useEffect(() => {
		setCheckboxes(
			allObjects.map(({ cid, schemaDid }) => ({
				cid,
				schemaDid,
				checked: false,
			}))
		)
	}, [allObjects])

	const initialize = async () => {
		if (buckets.length === 0) return

		dispatch(userGetAllSchemas(address))
		const bucketDids = buckets.map((item: Bucket) => item.did)
		await dispatch(userGetAllObjects({ bucketDids }))
	}

	const onChangeObject =
		(schemaDid: string) => (cid: string) => (checked: boolean) => {
			setCheckboxes((checkboxes) =>
				checkboxes.map((checkbox) => {
					if (checkbox.cid !== cid || checkbox.schemaDid !== schemaDid) {
						return checkbox
					}

					return {
						...checkbox,
						checked,
					}
				})
			)
		}

	const save = async () => {
		if (!label) {
			setError("The bucket name is required")
			return
		}

		const content = checkboxes
			.filter((checkbox) => checkbox.checked)
			.map((checkbox) => {
				return {
					type: "cid",
					schemaDid: checkbox.schemaDid,
					uri: checkbox.cid,
				}
			})

		const createBucketPayload = {
			label,
			address,
			content,
		}

		await dispatch(userCreateBucket(createBucketPayload))
		dispatch(userGetAllBuckets(address))
		closeModal()
	}
	const loading = useSelector(selectBucketCreationLoading)

	return (
		<div>
			{!loading && (
				<>
					<div className="rounded-2xl p-8">
						<div className="flex flex-row mb-2">
							<span className="flex-1 uppercase font-semibold text-custom-2xs text-default">
								New Bucket
							</span>

							<button
								className="font-extrabold text-button-transparent text-custom-sm"
								onClick={closeModal}
							>
								Cancel
							</button>
						</div>

						<input
							className="text-custom-xl text-default font-extrabold outline-0 w-full"
							type="text"
							placeholder="Bucket Name"
							value={label}
							onChange={({ target }) => {
								setError("")
								setLabel(target.value)
							}}
							autoFocus
						/>

						<div className="mb-6">
							<span className="text-tertiary-red block text-xs">
								{error}&nbsp;
							</span>
						</div>

						{checkboxes.length > 0 && (
							<div className="h-[50vh] overflow-y-auto pb-16">
								<span className="block mb-4 flex-1 uppercase font-semibold text-custom-2xs text-default">
									Add Objects From Schemas
								</span>
								{schemas.map((schema, index) => (
									<CheckboxListGroup
										label={schema.label}
										schemaDid={schema.did}
										objects={allObjects.filter(
											(object) => object.schemaDid === schema.did
										)}
										checkboxes={checkboxes.filter(
											(checkbox) => checkbox.schemaDid === schema.did
										)}
										onChange={onChangeObject(schema.did)}
										initialOpenState={index === 0}
										key={schema.did}
									/>
								))}
							</div>
						)}
					</div>

					<div className="dark bg-surface-default py-6 px-8 text-right rounded-b-2xl">
						<button
							onClick={save}
							className="text-skin-primary bg-skin-primary font-extrabold rounded py-2 px-6 min-w-[200px]"
						>
							Save
						</button>
					</div>
				</>
			)}

			{loading && (
				<div className="flex flex-col items-center">
					<div className="w-28 m-20 animate-reverse-spin">
						<RefreshSvg />
					</div>
				</div>
			)}
		</div>
	)
}

export default ModalCreateBucket
