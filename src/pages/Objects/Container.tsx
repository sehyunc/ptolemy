import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ByteTypeDownloadButton from "../../components/ByteTypeDownloadButton"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../redux/slices/authenticationSlice"

import {
	selectBuckets,
	selectBucketsLoading,
	userGetAllBuckets,
} from "../../redux/slices/bucketSlice"
import {
	selectObjectsList,
	selectObjectsLoading,
	userGetBucketObjects,
} from "../../redux/slices/objectsSlice"
import {
	selectSchemasLoading,
	selectSchemasMetadataList,
	userGetAllSchemas,
} from "../../redux/slices/schemasSlice"
import { MODAL_CONTENT_NEW_OBJECT } from "../../utils/constants"
import { SearchableListItem, SonrObject } from "../../utils/types"
import ObjectsPageComponent from "./Component"

function ObjectsPageContainer() {
	const { setModalContent, openModal } = useContext(AppModalContext)
	const dispatch: Function = useDispatch()
	const buckets = useSelector(selectBuckets)
	const schemaMetadata = useSelector(selectSchemasMetadataList)
	const [selectedSchema, setSelectedSchema] = useState(
		schemaMetadata[0]?.did || ""
	)
	const [selectedBucket, setSelectedBucket] = useState(buckets[0]?.did || "")
	const objectsList = useSelector(selectObjectsList)
	const schemasLoading = useSelector(selectSchemasLoading)
	const bucketsLoading = useSelector(selectBucketsLoading)
	const objectsLoading = useSelector(selectObjectsLoading)
	const address = useSelector(selectAddress)
	const loading = schemasLoading || objectsLoading || bucketsLoading

	useEffect(() => {
		async function initialize() {
			const [schemas, buckets] = await Promise.all([
				dispatch(userGetAllSchemas(address)),
				dispatch(userGetAllBuckets(address)),
			])

			if (!selectedSchema && schemas.payload.length > 0) {
				setSelectedSchema(schemas.payload[0])
			}

			if (!selectedBucket && buckets.payload.length > 0) {
				setSelectedBucket(buckets.payload[0].did)
			}
		}
		initialize()
	}, [])

	useEffect(() => {
		if (selectedBucket) {
			dispatch(
				userGetBucketObjects({
					bucketDid: selectedBucket,
				})
			)
		}
	}, [selectedBucket])

	useEffect(() => {
		if (selectedSchema && selectedBucket) {
			setModalContent({
				content: MODAL_CONTENT_NEW_OBJECT,
				props: {
					selectedSchema,
					selectedBucket,
					onChangeSchema: setSelectedSchema,
					onChangeBucket: setSelectedBucket,
					schemas: schemaMetadata,
				},
			})
		}
	}, [selectedSchema, selectedBucket])

	function openNewObjectModal() {
		setModalContent({
			content: MODAL_CONTENT_NEW_OBJECT,
			props: {
				selectedSchema,
				selectedBucket,
				onChangeSchema: setSelectedSchema,
				onChangeBucket: setSelectedBucket,
				schemas: schemaMetadata,
			},
		})
		openModal()
	}

	const getList = () => {
		const schema = schemaMetadata.find(
			(schema) => schema.did === selectedSchema
		)!

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

		return objectsList
			.filter((item) => item.schemaDid === selectedSchema)
			.map((object) =>
				Object.keys(object.data).reduce(objectReducer(object), {})
			)
	}

	return (
		<ObjectsPageComponent
			schemas={schemaMetadata}
			buckets={buckets}
			selectedSchema={selectedSchema}
			selectedBucket={selectedBucket}
			setSelectedBucket={setSelectedBucket}
			setSelectedSchema={setSelectedSchema}
			openNewObjectModal={openNewObjectModal}
			loading={loading}
			list={getList()}
			bucketCount={buckets.length}
			schemaCount={schemaMetadata.length}
		/>
	)
}

export default ObjectsPageContainer
