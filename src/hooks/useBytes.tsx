import { useDispatch } from "react-redux"
import { userGetObject } from "../redux/slices/objectsSlice"
import { downloadFileFromBase64 } from "../utils/files"
import { parseJsonFromBase64String } from "../utils/object"
import { SonrObject } from "../utils/types"

function useBytes() {
	const dispatch: Function = useDispatch()
	async function getBytesAndDownload({
		cid,
		key,
		schemaDid,
	}: {
		cid: string
		key: string
		schemaDid: string
	}) {
		const { payload: object }: { payload: SonrObject } = await dispatch(
			userGetObject({
				schemaDid,
				objectCid: cid,
			})
		)
		const bytes = object.data[key]?.["/"]?.bytes
		const { base64File, fileName } = parseJsonFromBase64String(bytes)
		downloadFileFromBase64(base64File, fileName)
	}

	return {
		getBytesAndDownload,
	}
}

export default useBytes
